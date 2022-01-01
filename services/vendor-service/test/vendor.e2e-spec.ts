import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { v4 as uuidV4 } from 'uuid';
import { FilesService } from '../src/files/files.service';
import { MessagingService } from '../src/messaging/messaging.service';
import { VendorCreationDto } from '../src/vendors/dtos/vendorCreationDto';
import { VendorsModule } from '../src/vendors/vendors.module';
import { VendorsService } from '../src/vendors/vendors.service';
import { of } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const owner = {
    id: uuidV4(),
  };

  const vendor = {
    name: 'Nike',
    email: 'test@gmail.com',
    hotline: '093920323455',
    logoUrl: 'https://images.com/vendor.jpg',
    ownerId: uuidV4(),

    toJSON: jest.fn(),
  };

  const vendorsService = {
    getById: jest.fn().mockResolvedValue(vendor),
    getByOwner: jest.fn().mockResolvedValue([vendor]),
    getAll: jest.fn().mockResolvedValue([vendor]),
    register: jest.fn().mockResolvedValue(vendor),
    find: jest.fn().mockResolvedValue([vendor]),
  };

  const ownersService = {
    getById: jest.fn(),
  };

  const messagingService = {
    uploadImages: jest.fn(),
  };

  const filesService = {
    getAllForOwner: jest
      .fn()
      .mockReturnValue(of({ files: [{ url: vendor.logoUrl }] })),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        VendorsModule,
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
      ],
    })
      .overrideProvider(VendorsService)
      .useValue(vendorsService)
      .overrideProvider(MessagingService)
      .useValue(messagingService)
      .overrideProvider(FilesService)
      .useValue(filesService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('[GET] /vendors', () => {
    it('should return expected vendors and ok status code', async () => {
      const response = await request(app.getHttpServer()).get('/vendors');

      expect(response.statusCode).toBe(HttpStatus.OK);
    });
  });

  describe('[GET] /vendors?ownerId=', () => {
    it('should return expected vendor and ok status code', async () => {
      const { toJSON, ...expectedVendor } = vendor;
      jest.spyOn(vendor, 'toJSON').mockReturnValue(expectedVendor);
      ownersService.getById.mockResolvedValue(owner);

      const response = await request(app.getHttpServer()).get(
        `/vendors?ownerId=${uuidV4()}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body).toStrictEqual([expectedVendor]);
    });

    it('not existing owner,should bad request status code', async () => {
      ownersService.getById.mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get(
        `/vendors?ownerId=${uuidV4()}`,
      );

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('[GET] /vendors/:id', () => {
    it('should return expected vendor and ok status code', async () => {
      const { toJSON, ...expectedVendor } = vendor;
      jest.spyOn(vendor, 'toJSON').mockReturnValue(expectedVendor);

      const response = await request(app.getHttpServer()).get(
        `/vendors/${uuidV4()}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body).toStrictEqual(expectedVendor);
    });

    it('invalid id, should return bas request', async () => {
      const response = await request(app.getHttpServer()).get(
        `/vendors/invalid-id`,
      );

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('[POST] /vendors', () => {
    it('existing vendor with incoming email and name, should bad request status code', async () => {
      const vendorCreationDto: VendorCreationDto = {
        ownerId: uuidV4(),
        name: 'Test',
        email: 'test@gmail.com',
        hotline: '093920323455',
        introduction: 'Nike is a company',
      };

      const response = await request(app.getHttpServer())
        .post('/vendors')
        .send(vendorCreationDto);

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return expected vendor with created status code', async () => {
      vendorsService.find.mockResolvedValue([]);

      const vendorCreationDto: VendorCreationDto = {
        ownerId: uuidV4(),
        name: 'Test',
        email: 'test@gmail.com',
        hotline: '093920323455',
        introduction: 'Nike is a company',
      };

      const response = await request(app.getHttpServer())
        .post('/vendors')
        .send(vendorCreationDto);

      expect(response.statusCode).toBe(HttpStatus.CREATED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
