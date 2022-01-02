import { CheckCircleFilled, ShoppingFilled } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Rate, Row, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { push } from 'connected-react-router';
import getSymbolFromCurrency from 'currency-symbol-map';
import { motion } from 'framer-motion';
import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { delay, map, of, tap } from 'rxjs';
import { mapProductToBasketItem } from '../../../helpers';
import { useUserData } from '../../../hooks';
import { Product } from '../../../models/catalog';
import { cartActions } from '../../cart';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps): ReactElement {
  const dispatch = useDispatch();
  const { accessToken, user } = useUserData();

  const [adding, setAdding] = useState(false);

  const {
    id,
    name,
    images,
    briefDescription,
    price,
    review,
    vendor,
    discount,
  } = product;
  const isOnSale = !!discount && Object.entries(discount).length > 0;

  const onAddToCartClick = () => {
    of(true)
      .pipe(
        tap(() => setAdding(true)),
        // * For animation
        delay(300),
        map(() => mapProductToBasketItem(product)),
        tap((item) =>
          dispatch(
            cartActions.addItem({ item, email: user?.email, accessToken })
          )
        )
      )
      .subscribe({ next: () => setAdding(false) });
  };

  const onViewDetailClick = () => {
    // Redirect to product detail page
    dispatch(push(`/products/${id}`));
  };

  const onViewVendorClick = () => {
    // Redirect to vendor page
    dispatch(push(`/vendors/${vendor.id}`));
  };

  const renderAddToCartButton = () => (
    <Button
      type="primary"
      style={{
        background: adding ? '#1eb72f' : 'var(--btn-primary-color)',
        border: 'none',
      }}
      className={styles.buttonContainer}
      onClick={onAddToCartClick}
    >
      <div className={styles.buttonContent}>
        <motion.div
          style={{ display: 'inline-flex' }}
          animate={{ rotate: adding ? 360 : 0 }}
          onAnimationComplete={() => setAdding(false)}
        >
          {adding ? <CheckCircleFilled /> : <ShoppingFilled />}
        </motion.div>
        <span>{adding ? 'Added!' : 'Add to cart'}</span>
      </div>
    </Button>
  );

  const renderPrice = () => (
    <Row align="middle">
      {isOnSale ? (
        <>
          <Typography.Text ellipsis className={styles.price}>
            <sup style={{ fontSize: '0.8rem' }}>
              {getSymbolFromCurrency(price.unit)}
            </sup>
            {discount.modifiedPrice.toLocaleString()}
          </Typography.Text>
          <span>
            {getSymbolFromCurrency(price.unit)}
            {price.amount.toLocaleString()}
          </span>
        </>
      ) : (
        <Typography.Text ellipsis className={styles.price}>
          <sup style={{ fontSize: '0.8rem' }}>
            {getSymbolFromCurrency(price.unit)}
          </sup>
          {price.amount.toLocaleString()}
        </Typography.Text>
      )}
    </Row>
  );

  const renderTitle = () => (
    <div className={styles.titleContainer}>
      <Typography.Title
        ellipsis
        level={4}
        className={styles.name}
        onClick={onViewDetailClick}
      >
        {name}
      </Typography.Title>
      {renderPrice()}
    </div>
  );

  return (
    <Card
      className={styles.container}
      cover={
        <motion.div className={styles.imgContainer}>
          <motion.div
            className={styles.img}
            style={{
              backgroundImage: `url(${images[0]?.url})`,
            }}
            whileHover={{ scale: 1.1 }}
            onClick={onViewDetailClick}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Meta
            title={renderTitle()}
            description={
              <Typography.Paragraph
                ellipsis={{ rows: 1 }}
                style={{ color: 'var(--font-color-dark-gray)' }}
              >
                {briefDescription}
              </Typography.Paragraph>
            }
          />
        </Col>

        <Col xs={24}>
          <Meta
            style={{ cursor: 'pointer' }}
            title={
              <Typography.Text onClick={onViewVendorClick}>
                {vendor.name}
              </Typography.Text>
            }
            avatar={<Avatar src={vendor.logoUrl} />}
          />
        </Col>

        <Col xs={24}>
          <Rate value={review.rating} disabled allowHalf />
        </Col>

        <Col xs={24}>
          <Typography.Text>{review.numberOfReviews} reviews</Typography.Text>
        </Col>

        <Col xs={24}>
          <Row justify="center">{renderAddToCartButton()}</Row>
        </Col>
      </Row>
    </Card>
  );
}
