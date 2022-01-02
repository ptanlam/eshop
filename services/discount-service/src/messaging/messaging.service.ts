import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class MessagingService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  // @RabbitSubscribe({
  //   queue: 'order.approved.catalog',
  //   exchange: 'order',
  //   routingKey: '',
  //   queueOptions: {},
  // })
  // public async rpcHandler(msg: any, amqpMsg: ConsumeMessage) {
  //   const message = await JSON.parse(amqpMsg.content.toString()).message;
  //   const res = this.productsService.adjustProductStock(message.items);
  //   return res;
  // }

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
