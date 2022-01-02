import { Col, Row, Typography } from 'antd';
import React, { ReactElement } from 'react';
import { Review } from '../../../models/review';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  list: Array<Review>;
}

export default function ReviewList({ list }: ReviewListProps): ReactElement {
  const renderList = () => {
    const hasReview = list.length > 0;

    if (!hasReview)
      return (
        <Typography.Text>
          There are currently no reviews for this product!
        </Typography.Text>
      );

    return list.map((review) => <ReviewCard key={review.id} review={review} />);
  };

  return (
    <Row gutter={[8, 8]}>
      <Col xs={24}>{renderList()}</Col>
    </Row>
  );
}
