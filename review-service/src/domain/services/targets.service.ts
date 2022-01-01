import { Inject } from '@nestjs/common';
import { from, iif, mergeMap, of } from 'rxjs';
import { targetsRepositoryProvideToken } from '../../constants';
import { Review, Target } from '../models';

export class TargetsService {
  constructor(
    @Inject(targetsRepositoryProvideToken)
    private readonly _targetsRepository: typeof Target,
  ) {}

  create(id: string) {
    return this.get(id).pipe(
      mergeMap((product) =>
        iif(
          () => !product,
          of(this._targetsRepository.build({ id, reviews: new Array() })).pipe(
            mergeMap((product) => from(product.save())),
          ),
          of(product as Target),
        ),
      ),
    );
  }

  get(id: string) {
    return from(this._targetsRepository.findByPk(id, { include: Review }));
  }
}
