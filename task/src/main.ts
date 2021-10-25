
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TaskModule } from './task.module';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TaskModule,
    {
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
    },
  );
  app
    .listen()
    .then(() => logger.log('Microservice Tasks is up'));
}
bootstrap();
