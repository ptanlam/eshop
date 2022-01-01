import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { vendorsRepositoryProvideToken } from '../constants';
import { VendorCreationDto } from './dtos/vendorCreationDto';
import { v4 as uuidV4 } from 'uuid';
import { Vendor } from './models/vendor.model';
import slugify from 'slugify';

@Injectable()
export class VendorsService {
  constructor(
    @Inject(vendorsRepositoryProvideToken)
    private readonly _vendorsRepository: typeof Vendor,
  ) {}

  async getAll(limit: number, offset: number) {
    const { rows, count } = await this._vendorsRepository.findAndCountAll({
      limit,
      offset: limit * offset,
    });

    return { data: rows, pagination: { total: count } };
  }

  async register(dto: VendorCreationDto) {
    const { name, email, hotline, ownerId, introduction } = dto;

    const vendor = this._vendorsRepository.build({
      id: uuidV4(),
      name,
      email,
      hotline,
      introduction,
      ownerId,
      slug: slugify(name, {
        trim: true,
        lower: true,
        replacement: '-',
        strict: true,
      }),
    });

    return vendor.save();
  }

  getById(id: string) {
    return this._vendorsRepository.findByPk(id);
  }

  async getByOwner(ownerId: string, limit: number, offset: number) {
    const { rows, count } = await this._vendorsRepository.findAndCountAll({
      where: { ownerId },
      limit,
      offset: limit * offset,
    });
    return { data: rows, pagination: { total: count } };
  }

  find(name: string, email: string, hotline: string) {
    return this._vendorsRepository.findAll({
      where: { [Op.or]: { email, name, hotline } },
    });
  }

  activate(id: string) {
    return this._vendorsRepository.update(
      { isActive: true },
      { where: { id }, returning: true },
    );
  }
}
