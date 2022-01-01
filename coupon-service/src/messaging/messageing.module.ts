import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import messagingConfig from './messaging.config';
import { MessagingService } from './messaging.service';

@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule.forFeature(messagingConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('rabbitmq.uri');
        if (!uri) throw new Error('rabbitmq uri is null or empty.');
        return { exchanges: [{ name: 'storage', type: 'topic' }], uri };
      },
    }),
  ],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
