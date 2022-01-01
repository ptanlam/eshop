import { Inject } from '@nestjs/common';
import { from, iif, mergeMap, of } from 'rxjs';
import { reviewersRepositoryProvideToken } from '../../constants';
import { Reviewer } from '../models';

export class ReviewersService {
  constructor(
    @Inject(reviewersRepositoryProvideToken)
    private readonly _reviewersRepository: typeof Reviewer,
  ) {}

  create(id: string, fullName: string, avatarUrl: string) {
    return this.get(id).pipe(
      mergeMap((reviewer) =>
        iif(
          () => !reviewer,
          of(this._reviewersRepository.build({ id, fullName, avatarUrl })).pipe(
            mergeMap((reviewer) => from(reviewer.save())),
          ),
          of(reviewer as Reviewer),
        ),
      ),
    );
  }

  get(id: string) {
    return from(this._reviewersRepository.findByPk(id));
  }
}
