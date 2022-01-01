import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, Observable, of } from 'rxjs';
import { filesPackageProvideToken } from '../constants';
import { GetAllForOwnerRequest } from './interfaces/getAllForOwnerRequest';
import { GetAllForOwnerResponse } from './interfaces/getAllForOwnerResponse';

interface IFilesService {
  getAllForOwner(
    data: GetAllForOwnerRequest,
  ): Observable<GetAllForOwnerResponse>;
}

@Controller()
export class FilesService implements IFilesService, OnModuleInit {
  private _filesService!: IFilesService;

  constructor(
    @Inject(filesPackageProvideToken)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this._filesService = this.client.getService<FilesService>('FilesService');
  }

  getAllForOwner(
    data: GetAllForOwnerRequest,
  ): Observable<GetAllForOwnerResponse> {
    return this._filesService
      .getAllForOwner(data)
      .pipe(
        catchError((_) =>
          of({ files: [{ id: '', ownerId: data.ownerId, url: '' }] }),
        ),
      );
  }
}
