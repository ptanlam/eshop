import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { filesPackageProvideToken } from '../constants';
import { GetAllForOwnerRequest } from './interfaces/getAllForOwnerRequest';
import { GetAllForOwnerResponse } from './interfaces/getAllForOwnerResponse';
import { UploadFilesForOwnerRequest } from './interfaces/uploadFilesForOwnerRequest.interface';
import { UploadFilesForOwnerResponse } from './interfaces/uploadFilesForOwnerResponse.interface';

interface IFilesService {
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
    return this._filesService.getAllForOwner(data);
  }

  uploadForOwner(
    data: UploadFilesForOwnerRequest,
  ): Observable<UploadFilesForOwnerResponse> {
    return this._filesService.uploadForOwner(data);
  }
}
