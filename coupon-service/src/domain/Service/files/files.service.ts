import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { filesPackageProvideToken } from 'src/constants';
import {
  GetAllForOwnerRequest,
  GetAllForOwnerResponse,
  UploadFilesForOwnerRequest,
  UploadFilesForOwnerResponse,
} from 'src/interfaces/Files';

export interface IFilesService {
  getAllForOwner(
    data: GetAllForOwnerRequest,
  ): Observable<GetAllForOwnerResponse>;

  uploadForOwner(
    data: UploadFilesForOwnerRequest,
  ): Observable<UploadFilesForOwnerResponse>;
}

@Controller()
export class FilesService implements IFilesService, OnModuleInit {
  private filesService!: IFilesService;
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @Inject(filesPackageProvideToken)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.filesService = this.client.getService<IFilesService>(
      FilesService.name,
    );
  }

  getAllForOwner(
    data: GetAllForOwnerRequest,
  ): Observable<GetAllForOwnerResponse> {
    return this.filesService.getAllForOwner(data).pipe(
      catchError((error: RpcException) =>
        of(error).pipe(
          tap((error) => this.logger.error(error.message)),
          map(() => ({ files: [] })),
        ),
      ),
    );
  }

  uploadForOwner(
    data: UploadFilesForOwnerRequest,
  ): Observable<UploadFilesForOwnerResponse> {
    return this.filesService.uploadForOwner(data).pipe(
      catchError((error: RpcException) =>
        of(error).pipe(
          tap((error) => this.logger.error(error.message)),
          map(() => ({ urls: [] })),
        ),
      ),
    );
  }
}
