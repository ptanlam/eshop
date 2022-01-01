import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { from, iif, map, mergeMap, Observable, of, toArray, zip } from 'rxjs';
import {
  GetCountAndRatingForTargetRequest,
  GetCountAndRatingForTargetResponse,
} from '../../domain/interfaces';
import { Review } from '../../domain/models';
import {
  FilesService,
  ReactionsService,
  ReviewsService,
} from '../../domain/services';
import { GetReviewsByConditionsDto, ReviewCreationDto } from '../dtos';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly _reviewsService: ReviewsService,
    private readonly _filesService: FilesService,
    private readonly _reactionsService: ReactionsService,
  ) {}

  @Get()
  @ApiTags('Reviews')
  @ApiOkResponse({
    description: 'Returns the list of reviews for target.',
  })
  getReviewsByConditions(@Query() dto: GetReviewsByConditionsDto) {
    return this._reviewsService.getReviewsByConditions(dto).pipe(
      mergeMap((result) =>
        iif(
          () => !!result.data.length,
          of(result).pipe(
            mergeMap((result) =>
              from(result.data)
                .pipe(
                  mergeMap((review) =>
                    this.getAdditionalInformationForReview$(review),
                  ),
                  toArray(),
                )
                .pipe(map((response) => ({ ...result, data: response }))),
            ),
          ),
          of(result),
        ),
      ),
    );
  }

  @GrpcMethod('ReviewsService', 'GetCountAndRatingForTarget')
  getCountAndRatingForTarget(
    request: GetCountAndRatingForTargetRequest,
  ): Observable<GetCountAndRatingForTargetResponse> {
    const targetIds = request.targetIds.trim().split(',');
    return this._reviewsService
      .getCountAndRating(targetIds)
      .pipe(map((result) => ({ response: result })));
  }

  @Post()
  @ApiTags('Reviews')
  @ApiBody({ type: ReviewCreationDto })
  @ApiCreatedResponse({
    description: 'Added review for target successfully.',
  })
  @UseInterceptors(FilesInterceptor('images'))
  addReview(
    @Body() dto: ReviewCreationDto,
    @UploadedFiles() images?: Array<Express.Multer.File>,
  ) {
    return this._reviewsService.addReview(dto).pipe(
      mergeMap((review) =>
        iif(
          () => !!images && images.length > 0,
          of(review).pipe(
            mergeMap((review) =>
              this._filesService
                .uploadForOwner({
                  ownerId: review.id,
                  files: images!.map(({ originalname, buffer, mimetype }) => ({
                    filename: originalname,
                    buffer,
                    mimetype,
                  })),
                })
                .pipe(
                  map(({ urls }) => ({ ...review.toJSON(), images: urls })),
                ),
            ),
          ),
          of({ ...review.toJSON(), images: new Array<string>() }),
        ),
      ),
    );
  }

  private getAdditionalInformationForReview$ = (review: Review) =>
    zip(
      this.getImagesForReview$(review.id),
      this.getReactionsForReview$(review.id),
    ).pipe(
      map(([images, reactions]) => ({
        ...review.toJSON(),
        images,
        reactions,
      })),
    );

  private getImagesForReview$ = (id: string) =>
    this._filesService
      .getAllForOwner({ ownerId: id })
      .pipe(map((response) => response?.files || []));

  private getReactionsForReview$ = (id: string) =>
    this._reactionsService
      .getAllForTarget({ id })
      .pipe(map((response) => response?.reactions || []));
}
