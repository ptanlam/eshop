import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagingService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

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
