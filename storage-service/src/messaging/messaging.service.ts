import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { mergeMap } from 'rxjs';
import { FilesService } from '../files/files.service';
import { S3Service } from '../s3/s3.service';
import { FilesUploadRequestDto } from './dtos/filesUploadRequestDto';

@Injectable()
export class MessagingService {
  constructor(
    private readonly _storageService: S3Service,
    private readonly _filesService: FilesService,
  ) {}

  @RabbitSubscribe({
    queue: 'storage',
    exchange: 'storage',
    routingKey: 'storage.routing-key',
  })
  public uploadRequestHandler(message: FilesUploadRequestDto) {
    this._storageService
      .uploadMany(message.files)
      .pipe(
        mergeMap((urls) => this._filesService.saveFiles(message.ownerId, urls)),
      )
      .subscribe();
  }
}
