import { Avatar, Col, Comment, Image, Rate, Row, Typography } from 'antd';
import React, { ReactElement } from 'react';
import { Review } from '../../../models/review';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps): ReactElement {
  const { content, reviewer, createdAt, rating, images } = review;

  return (
    <Comment
      author={reviewer.fullName}
      content={
        <>
          <Rate value={rating} allowHalf disabled />
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            {content}
          </Typography.Paragraph>
        </>
      }
      avatar={<Avatar src={reviewer.avatarUrl} />}
      datetime={new Date(createdAt).toLocaleString()}
    >
      <Row gutter={[4, 4]}>
        <Col xs={24}>
          <Row gutter={[4, 4]}>
            {images.map(({ url, id }) => (
              <Col key={id}>
                <Image src={url} className={styles.img} />
              </Col>
            ))}
          </Row>
        </Col>

        {/* <Col xs={24}>
          <Row gutter={[4, 4]}>
            <Col>
              <Button
                icon={ownedReaction.liked ? <LikeFilled /> : <LikeOutlined />}
                type="text"
                shape="round"
                loading={isAuthenticating}
              >
                {reactionCount.likes}
              </Button>
            </Col>
            <Col>
              <Button
                icon={
                  ownedReaction.disliked ? (
                    <DislikeFilled />
                  ) : (
                    <DislikeOutlined />
                  )
                }
                type="text"
                shape="round"
                loading={isAuthenticating}
              >
                {reactionCount.dislikes}
              </Button>
            </Col>
          </Row>
        </Col> */}
      </Row>
    </Comment>
  );
}
