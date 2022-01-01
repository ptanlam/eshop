import { Test } from '@nestjs/testing';
import { targetsRepositoryProvideToken } from '../../../constants';
import { mockTargetsRepository, testTarget } from '../../../helpers';
import { TargetsService } from '../../services';
import { v4 as uuidV4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

describe('TargetsService unit tests', () => {
  let targetsService: TargetsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TargetsService,
        {
          provide: targetsRepositoryProvideToken,
          useValue: mockTargetsRepository,
        },
      ],
    }).compile();

    targetsService = moduleRef.get<TargetsService>(TargetsService);
  });

  describe('get', () => {
    it('should return expected product', async () => {
      const target = await firstValueFrom(targetsService.get(uuidV4()));

      expect(target).toBe(testTarget);
    });
  });
});
