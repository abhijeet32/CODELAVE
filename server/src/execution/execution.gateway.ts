import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { ExecutionService } from './execution.service';

interface ExecutePayload {
  sandboxId: string;
  code: string;
  language?: string;
}

@WebSocketGateway({
  namespace: '/ws/execute',
  cors: { origin: '*' },
})
export class ExecutionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ExecutionGateway.name);

  constructor(
    private readonly executionService: ExecutionService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Authenticate WebSocket connection via API key in handshake.
   */
  async handleConnection(client: Socket): Promise<void> {
    try {
      const apiKey =
        (client.handshake.auth?.apiKey as string) ||
        (client.handshake.headers?.['x-api-key'] as string) ||
        (client.handshake.query?.apiKey as string);

      if (!apiKey) {
        throw new UnauthorizedException('Missing API key');
      }

      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

      const keyRecord = await this.prisma.apiKey.findUnique({
        where: { key: hashedKey },
        include: { user: true },
      });

      if (!keyRecord || !keyRecord.isActive) {
        throw new UnauthorizedException('Invalid API key');
      }

      if (keyRecord.user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User account not active');
      }

      // Store user info on the socket
      (client as any).userId = keyRecord.userId;
      (client as any).userEmail = keyRecord.user.email;

      this.logger.log(`WebSocket client connected: ${client.id}`);
    } catch (error: any) {
      this.logger.warn(`WebSocket auth failed: ${error.message}`);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`WebSocket client disconnected: ${client.id}`);
  }

  /**
   * Handle streaming code execution.
   *
   * Client emits: 'execute' { sandboxId, code, language? }
   * Server emits:
   *   'output' { chunk, isStderr }  — per output chunk
   *   'done' { execution }          — on completion
   *   'error' { message }           — on failure
   */
  @SubscribeMessage('execute')
  async handleExecute(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ExecutePayload,
  ): Promise<void> {
    const userId = (client as any).userId as string;

    if (!userId) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    if (!payload.sandboxId || !payload.code) {
      client.emit('error', { message: 'sandboxId and code are required' });
      return;
    }

    try {
      await this.executionService.executeCodeStreaming(
        userId,
        payload.sandboxId,
        payload.code,
        payload.language || 'python',
        {
          onData: (chunk, isStderr) => {
            client.emit('output', { chunk, isStderr });
          },
          onDone: (execution) => {
            client.emit('done', { execution });
          },
          onError: (error) => {
            client.emit('error', { message: error });
          },
        },
      );
    } catch (error: any) {
      client.emit('error', { message: error.message || 'Execution failed' });
    }
  }
}
