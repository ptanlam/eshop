import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidV4 } from 'uuid';
import { vendorsRepositoryProvideToken } from '../constants';
import { vendor, vendorCreationDto } from '../helpers/testData';
import { mockVendorModel } from '../helpers/testModels';
import { VendorsService } from './vendors.service';

describe('VendorsService', () => {
  let service: VendorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorsService,
        {
          provide: vendorsRepositoryProvideToken,
          useValue: mockVendorModel,
        },
      ],
    }).compile();

    service = module.get<VendorsService>(VendorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create expected vendor', async () => {
      jest.spyOn(vendor, 'save').mockResolvedValue(vendor);

      const result = await service.register(vendorCreationDto);

      expect(result).toBe(vendor);
      expect(mockVendorModel.build).toBeCalled();
      expect(vendor.save).toBeCalled();
    });
  });

  describe('getById', () => {
    it('should return expected vendor', async () => {
      mockVendorModel.findByPk.mockResolvedValue(vendor);

      const result = await service.getById(uuidV4());

      expect(result).toBe(vendor);
      expect(mockVendorModel.findByPk).toBeCalled();
    });
  });

  describe('find', () => {
    it('should return expected vendor', async () => {
      mockVendorModel.findAll.mockResolvedValue([vendor]);

      const result = await service.find(
        'test',
        'test@gmail.com',
        '13401483724',
      );

      expect(result).toStrictEqual([vendor]);
      expect(mockVendorModel.findByPk).toBeCalled();
    });
  });

  describe('getByOwner', () => {
    it('should return expected vendor', async () => {
      const result = await service.getByOwner(uuidV4(), 10, 0);

      expect(result.data).toStrictEqual([vendor]);
      expect(mockVendorModel.findAll).toBeCalled();
    });
  });

  describe('getAll', () => {
    it('should return expected vendors', async () => {
      const result = await service.getAll(10, 0);

      expect(result.data).toStrictEqual([vendor]);
    });
  });

  describe('activate', () => {
    it('should activate vendor', async () => {
      mockVendorModel.findByPk.mockResolvedValue(vendor);

      const [affectedRows, vendors] = await service.activate(uuidV4());

      expect(affectedRows).toBe(1);
      expect(vendors[0].isActive).toBeTruthy();
    });
  });
});
