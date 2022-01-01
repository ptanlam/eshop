import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagingService {
  constructor(private readonly _amqpConnection: AmqpConnection) {}

  async uploadImages(vendorId: string, files: Array<Express.Multer.File>) {
    const filteredFiles = files.map(({ originalname, buffer, mimetype }) => ({
      filename: originalname,
      buffer,
      mimetype,
    }));

    await this._amqpConnection.publish(
      'storage',
      'storage.routing-key',
      {
        ownerId: vendorId,
        files: filteredFiles,
      },
      {},
    );
  }
}
