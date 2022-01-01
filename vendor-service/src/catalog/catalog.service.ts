import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { catalogPackageProvideToken } from '../constants';
import { GetCategoryListForVendorRequest } from './interfaces/getCategoryListForVendorRequest.interface';
import { GetCategoryListForVendorResponse } from './interfaces/getCategoryListForVendorResponse.interface';

interface ICatalogService {
  getCategoryListForVendor(
    request: GetCategoryListForVendorRequest,
  ): Observable<GetCategoryListForVendorResponse>;
}

@Controller()
export class CatalogService implements ICatalogService, OnModuleInit {
  private _catalogService!: ICatalogService;

  constructor(
    @Inject(catalogPackageProvideToken)
    private readonly _client: ClientGrpc,
  ) {}

  onModuleInit() {
    this._catalogService =
      this._client.getService<ICatalogService>('ProductsService');
  }

  getCategoryListForVendor(
    request: GetCategoryListForVendorRequest,
  ): Observable<GetCategoryListForVendorResponse> {
    return this._catalogService.getCategoryListForVendor(request);
  }
}
