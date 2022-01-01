import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { stringify } from 'qs';
import * as request from 'supertest';
import { ReviewsModule } from '../src/infrastructure/modules';
import { v4 as uuidV4 } from 'uuid';

describe('ReviewsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ReviewsModule,
        ConfigModule.forRoot({ envFilePath: '.env.development' }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/reviews (GET)', () => {
    const dto = {
      limit: 10,
      offset: 0,
    };

    const query = stringify(dto);

    return request(app.getHttpServer())
      .get('/reviews')
      .query(query)
      .expect(200);
  });

  it('/reviews (POST)', () => {
    const dto = {
      content: 'this product is amazing',
      rating: 5,
      reviewerId: 'reviewerId',
      reviewerFullName: 'Full Name',
      productId: uuidV4(),
    };

    return request(app.getHttpServer()).post('/reviews').expect(201);
  });
});
