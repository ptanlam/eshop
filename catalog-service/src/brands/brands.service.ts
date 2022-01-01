import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { brandPackageToken } from '../constants';
import { GetVendorInfoRequest } from './interfaces/getVendorInfoRequest.interface';
import { GetVendorInfoResponse } from './interfaces/getVendorInfoResponse.interface';

interface IBrandsService {
  getNameAndLogoUrl(
    data: GetVendorInfoRequest,
  ): Observable<GetVendorInfoResponse>;
}

@Controller()
export class BrandsService implements OnModuleInit, IBrandsService {
  private _brandsService: IBrandsService;
  constructor(
    @Inject(brandPackageToken)
    private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this._brandsService =
      this.client.getService<IBrandsService>('VendorsService');
  }

  getNameAndLogoUrl(
    data: GetVendorInfoRequest,
  ): Observable<GetVendorInfoResponse> {
    return this._brandsService.getNameAndLogoUrl(data);
  }
}
