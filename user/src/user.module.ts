import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLinkSchema } from './schemas/user-link.schema';
import { UserSchema } from './schemas/user.schema';
import { ConfigService } from './services/config/config.service';
import { MongoConfigService } from './services/config/mongo-config.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        collection: 'users',
      },
      {
        name: 'UserLink',
        schema: UserLinkSchema,
        collection: 'user_links',
      },
    ]),
    ClientsModule.register([
      {
        name: 'MAILER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [{
          protocol: "amqp",
          port: 5672,
          hostname: "rabbitmq",
          username: process.env.RABBITMQ_DEFAULT_USER,
          password: process.env.RABBITMQ_DEFAULT_PASS
        }],
          queue: 'mailer_queue',
          queueOptions: {
            durable: false,
          },
        },
      },      
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ConfigService,
  ],
})
export class UserModule {}
