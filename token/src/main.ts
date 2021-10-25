import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TokenModule } from './token.module';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TokenModule,
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
        queue: 'tokens_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app
    .listen()
    .then(() => logger.log('Microservice Tokens is up'));
}
bootstrap();
