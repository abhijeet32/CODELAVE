import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SandboxModule } from './sandbox/sandbox.module';
import { ExecutionModule } from './execution/execution.module';
import { FilesModule } from './files/files.module';
import { LifecycleModule } from './lifecycle/lifecycle.module';
import { UsageModule } from './usage/usage.module';
import { DockerModule } from './docker/docker.module';

@Module({
  imports: [
    // Config from environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Scheduled tasks (lifecycle cron jobs)
    ScheduleModule.forRoot(),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ([{
        ttl: (configService.get<number>('THROTTLE_TTL', 60)) * 1000,
        limit: configService.get<number>('THROTTLE_LIMIT', 30),
      }]),
    }),

    // Core modules
    DatabaseModule,
    DockerModule,

    // Feature modules
    AuthModule,
    SandboxModule,
    ExecutionModule,
    FilesModule,
    LifecycleModule,
    UsageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
