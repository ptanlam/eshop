import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { from, map, mergeMap, Observable, of } from 'rxjs';
import { S3Service } from '../s3/s3.service';
import { FilesService } from './files.service';
import { GetAllForOwnerRequest } from './interfaces/getAllForOwnerRequest.interface';
import { GetAllForOwnerResponse } from './interfaces/getAllForOwnerResponse.interface';
import { UploadFilesForOwnerRequest } from './interfaces/uploadFilesForOwnerRequest.interface';
import { UploadFilesForOwnerResponse } from './interfaces/uploadFilesForOwnerResponse.interface';

@Controller('files')
export class FilesController {
  constructor(
    private readonly _filesService: FilesService,
    private readonly _s3Service: S3Service,
  ) {}

  @GrpcMethod('FilesService')
  getAllForOwner(
    data: GetAllForOwnerRequest,
  ): Observable<GetAllForOwnerResponse> {
    return this._filesService
      .getAllForOwner(data.ownerId)
      .pipe(map((files) => ({ files })));
  }

  @GrpcMethod('FilesService')
  uploadForOwner(
    data: UploadFilesForOwnerRequest,
  ): Observable<UploadFilesForOwnerResponse> {
    const { ownerId, files } = data;

    console.log(data);

    // return this._s3Service.

    return this._s3Service
      .uploadMany(files)
      .pipe(
        mergeMap((urls) =>
          this._filesService
            .saveFiles(ownerId, urls)
            .pipe(map(() => ({ urls }))),
        ),
      );
  }
}
