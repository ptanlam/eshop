import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidV4 } from 'uuid';
import { CatalogService } from '../catalog/catalog.service';
import { FilesService } from '../files/files.service';
import { vendor, vendorCreationDto } from '../helpers/testData';
import {
  mockCatalogService,
  mockFilesServiceService,
  mockMessagingService,
  mockVendorsService,
} from '../helpers/testServices';
import { MessagingService } from '../messaging/messaging.service';
import { Vendor } from './models/vendor.model';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

describe('VendorsController', () => {
  let controller: VendorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorsController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesServiceService,
        },
        {
          provide: VendorsService,
          useValue: mockVendorsService,
        },
        {
          provide: MessagingService,
          useValue: mockMessagingService,
        },
        {
          provide: CatalogService,
          useValue: mockCatalogService,
        },
      ],
    }).compile();

    controller = module.get<VendorsController>(VendorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return expected vendors', async () => {
      const result = await controller.getByConditions({
        limit: 10,
        offset: 0,
      });

      expect(result.data).toStrictEqual([{ ...vendor.toJSON(), logoUrl: '' }]);
    });
  });

  describe('register', () => {
    it('existing email, should not create new vendor', async () => {
      mockVendorsService.find.mockResolvedValue([vendor]);

      try {
        const _ = await controller.register(vendorCreationDto);
      } catch (error) {
      } finally {
        expect(mockVendorsService.find).toBeCalled();
        expect(mockVendorsService.register).toBeCalledTimes(0);
      }
    });

    it('should call register function in service and return expected vendor', async () => {
      mockVendorsService.find.mockResolvedValue([]);

      const result = await controller.register(vendorCreationDto);

      expect(result).toBe(vendor);
      expect(mockVendorsService.register).toBeCalled();
      expect(mockVendorsService.find).toBeCalled();
    });
  });

  describe('getById', () => {
    it('should return expected vendor', async () => {
      const _ = await controller.getById(uuidV4());

      expect(mockVendorsService.getById).toBeCalled();
    });
  });

  describe('getByOwner', () => {
    it('should throw error if owner has not existed', async () => {
      mockVendorsService.getByOwner.mockResolvedValue({
        data: [],
        pagination: { total: 0 },
      });

      try {
        const _ = await controller.getByConditions({
          ownerId: uuidV4(),
          limit: 10,
          offset: 0,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    it('should return expected vendor', async () => {
      const response = await controller.update(uuidV4(), { active: true });
      const vendor = response as Vendor;

      expect(vendor.isActive).toBeTruthy();
    });

    it('should return not found if vendor not found', async () => {
      mockVendorsService.getById.mockResolvedValue(null);

      const response = await controller.update(uuidV4(), { active: true });

      expect(response).toBeInstanceOf(NotFoundException);
    });
  });
});
