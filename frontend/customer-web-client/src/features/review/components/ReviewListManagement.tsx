import { LoadingOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { Col, Pagination, Row, Typography } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { filter, mergeMap, of, tap } from 'rxjs';
import { ApplicationContext } from '../../../contexts';
import { useUserData } from '../../../hooks';
import { Review, ReviewForCreation } from '../../../models/review';
import { PaginationMeta } from '../../../models/shared';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ReviewListManagementProps {
  targetId: string;
}

export function ReviewListManagement({
  targetId,
}: ReviewListManagementProps): ReactElement {
  const { reviewService } = useContext(ApplicationContext);
  const { isAuthenticated } = useAuth0();
  const { accessToken, user } = useUserData();

  const [imageList, setImageList] = useState<Array<UploadFile<any>>>([]);
  const [postingReview, setPostingReview] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [reviewList, setReviewList] = useState<Array<Review>>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    limit: 10,
    offset: 0,
    total: 0,
  });
  const { limit, offset } = pagination;

  useEffect(() => {
    const fetchReviewList$ = of(true)
      .pipe(
        tap(() => setFetching(true)),
        filter(() => !!targetId),
        mergeMap(() =>
          reviewService!.fetchForTarget(limit, offset, targetId).pipe(
            tap((response) => {
              setReviewList(response.data);
              setPagination((prev) => ({ ...prev, ...response.pagination }));
            })
          )
        )
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });

    return () => fetchReviewList$.unsubscribe();
  }, [reviewService, limit, offset, targetId]);

  const onPageChange = (pageNumber: number) =>
    setPagination((prev) => ({ ...prev, offset: pageNumber - 1 }));

  const onImageListChange = (data: UploadChangeParam<UploadFile<any>>) => {
    setImageList(data.fileList);
  };

  const populateFormData = (content: string, rating: number) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('rating', rating.toString());
    formData.append('targetId', targetId);
    formData.append('reviewerId', user!.sub!);
    formData.append('reviewerFullName', user!.name!);
    formData.append('reviewerAvatarUrl', user!.picture!);

    if (imageList.length) {
      const images = imageList.map((img) => img.originFileObj) as File[];
      images.forEach((image) => formData.append('images', image));
    }

    return formData;
  };

  const onSubmit = (
    values: Pick<ReviewForCreation, 'content' | 'rating' | 'images'>
  ) => {
    const review = populateFormData(values.content, values.rating);

    of(true)
      .pipe(filter(() => isAuthenticated))
      .pipe(
        tap(() => setPostingReview(true)),
        mergeMap(() =>
          reviewService!
            .addToTarget(accessToken, review)
            .pipe(
              tap((addedReview) =>
                setReviewList((prev) => [addedReview, ...prev])
              )
            )
        )
      )
      .subscribe({
        error: () => setPostingReview(false),
        complete: () => setPostingReview(false),
      });
  };

  return (
    <Row gutter={[8, 8]}>
      <Col xs={24}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Reviews
        </Typography.Title>
      </Col>

      <Col xs={24}>
        {fetching ? <LoadingOutlined /> : <ReviewList list={reviewList} />}
      </Col>

      <Col xs={24}>
        <Pagination
          pageSize={pagination.limit}
          current={pagination.offset + 1}
          total={pagination.total}
          size="small"
          onChange={onPageChange}
          hideOnSinglePage={true}
        />
      </Col>

      <Col xs={24}>
        {isAuthenticated ? (
          <ReviewForm
            imageList={imageList}
            onSubmit={onSubmit}
            postingReview={postingReview}
            onImageListChange={onImageListChange}
          />
        ) : (
          <Typography.Text>
            Please login to review this product!
          </Typography.Text>
        )}
      </Col>
    </Row>
  );
}
