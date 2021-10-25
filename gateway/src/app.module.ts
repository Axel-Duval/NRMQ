import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard } from './services/guards/authorization.guard';
import { PermissionGuard } from './services/guards/permission.guard';
import { TasksController } from './tasks.controller';
import { UsersController } from './users.controller';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TOKEN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [{
          protocol: "amqp",
          port: 5672,
          hostname: "rabbitmq",
          username: process.env.RABBITMQ_DEFAULT_USER,
          password: process.env.RABBITMQ_DEFAULT_PASS
        }],
          queue: 'tokens_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [{
          protocol: "amqp",
          port: 5672,
          hostname: "rabbitmq",
          username: process.env.RABBITMQ_DEFAULT_USER,
          password: process.env.RABBITMQ_DEFAULT_PASS
        }],
          queue: 'users_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'PERMISSION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [{
          protocol: "amqp",
          port: 5672,
          hostname: "rabbitmq",
          username: process.env.RABBITMQ_DEFAULT_USER,
          password: process.env.RABBITMQ_DEFAULT_PASS
        }],
          queue: 'permissions_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'TASK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [{
          protocol: "amqp",
          port: 5672,
          hostname: "rabbitmq",
          username: process.env.RABBITMQ_DEFAULT_USER,
          password: process.env.RABBITMQ_DEFAULT_PASS
        }],
          queue: 'tasks_queue',
          queueOptions: {
            durable: false,
          },
        },
      }
    ]),
  ],
  controllers: [UsersController, TasksController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
