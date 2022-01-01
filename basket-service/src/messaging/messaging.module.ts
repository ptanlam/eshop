import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

import { BasketModule } from '../domain/Service/basket/basket.module';
import { BasketService } from '../domain/Service/basket/basket.service';
import { MessagingService } from './messaging.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'order',
          type: 'fanout',
        },
      ],
      uri: 'amqps://xcmctebu:JL4f78Nnv8ViS9tCz6jOPRgOjYwYI2up@cattle.rmq2.cloudamqp.com/xcmctebu',
    }),
    MessagingModule,
    BasketModule,
  ],
  providers: [MessagingService, BasketService],
})
export class MessagingModule {}
