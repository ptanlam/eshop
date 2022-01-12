import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { ProductsService } from '../products/products.service';

@Injectable()
export class MessagingService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly productsService: ProductsService,
  ) {}

  @RabbitSubscribe({
    queue: 'order.approved.catalog',
    exchange: 'order',
    routingKey: '',
    queueOptions: {},
  })
  public async rpcHandler(msg: any, amqpMsg: ConsumeMessage) {
    const message = await JSON.parse(amqpMsg.content.toString()).message;
    try {
      const result = await this.productsService.adjustProductStock(
        message?.items,
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  //TODO if het hang thi tra ve mot message cho vendor

  @RabbitSubscribe({
    queue: 'order.cancelled.catalog',
    exchange: 'order',
    routingKey: '',
    queueOptions: {},
  })
  public async orderCancelledHandler(msg: any, amqpMsg: ConsumeMessage) {
    const message = await JSON.parse(amqpMsg.content.toString()).message;
    console.log(message);
  }

  public async saveFiles(ownerId: string, filesParam: Express.Multer.File[]) {
    const files = filesParam.map((file) => ({
      filename: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
    }));

    await this.amqpConnection.publish(
      'storage',
      'storage.routing-key',
      {
        ownerId,
        files,
      },
      {},
    );
  }
}
