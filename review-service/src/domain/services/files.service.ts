import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { filesPackageProvideToken } from '../../constants';
import {
  GetAllForOwnerRequest,
  GetAllForOwnerResponse,
  UploadFilesForOwnerRequest,
  UploadFilesForOwnerResponse,
} from '../interfaces';

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
  private _filesService!: IFilesService;
  private readonly _logger = new Logger(FilesService.name);

  constructor(
    @Inject(filesPackageProvideToken)
    private readonly _client: ClientGrpc,
  ) {}

  onModuleInit() {
    this._filesService = this._client.getService<IFilesService>(
      FilesService.name,
    );
  }

  getAllForOwner(
    data: GetAllForOwnerRequest,
  ): Observable<GetAllForOwnerResponse> {
    return this._filesService.getAllForOwner(data).pipe(
      catchError((error: RpcException) =>
        of(error).pipe(
          tap((error) => this._logger.error(error.message)),
          map(() => ({ files: [] })),
        ),
      ),
    );
  }

  uploadForOwner(
    data: UploadFilesForOwnerRequest,
  ): Observable<UploadFilesForOwnerResponse> {
    return this._filesService.uploadForOwner(data).pipe(
      catchError((error: RpcException) =>
        of(error).pipe(
          tap((error) => this._logger.error(error.message)),
          map(() => ({ urls: [] })),
        ),
      ),
    );
  }
}
