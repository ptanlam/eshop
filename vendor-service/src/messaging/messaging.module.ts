import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import messagingConfig from './messaging.config';
import { MessagingService } from './messaging.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule.forFeature(messagingConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('rabbitmq.uri');
        return { uri: uri! };
      },
    }),
    MessagingModule,
  ],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
