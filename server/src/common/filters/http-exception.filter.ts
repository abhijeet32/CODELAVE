import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  message: string;
  error: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = HttpStatus[statusCode] || 'Error';
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = Array.isArray(resp['message'])
          ? (resp['message'] as string[]).join(', ')
          : (resp['message'] as string) || exception.message;
        error = (resp['error'] as string) || HttpStatus[statusCode] || 'Error';
      } else {
        message = exception.message;
        error = HttpStatus[statusCode] || 'Error';
      }
    } else if (exception instanceof Error) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Internal Server Error';

      // Log the full error for debugging — never expose stack to client
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
        {
          path: request.url,
          method: request.method,
        },
      );
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    // Log all errors with request context (never log sensitive data)
    this.logger.warn(`${request.method} ${request.url} → ${statusCode}`, {
      statusCode,
      path: request.url,
      method: request.method,
      error,
    });

    const body: ErrorResponseBody = { statusCode, message, error };
    response.status(statusCode).json(body);
  }
}
