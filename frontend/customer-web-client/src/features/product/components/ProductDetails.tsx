import {
  Button,
  Carousel,
  Col,
  Descriptions,
  Row,
  Typography,
  Image,
} from 'antd';
import getSymbolFromCurrency from 'currency-symbol-map';
import React, { ReactElement, useState } from 'react';
import { fromEvent, tap } from 'rxjs';
import { ProductDetails as ProductDetailModel } from '../../../models/catalog';
import { generateKeyForArray } from '../../../utils';
import { ReviewListManagement } from '../../review/components';
import styles from './ProductDetails.module.css';

interface ProductDetailsOnMobileProps {
  details: ProductDetailModel;
  onCheckoutClick: () => void;
  onAddToCartClick: () => void;
  onViewVendorDetailsClick: () => void;
}

export function ProductDetails({
  details,
  onCheckoutClick,
  onAddToCartClick,
  onViewVendorDetailsClick,
}: ProductDetailsOnMobileProps): ReactElement {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  fromEvent(window, 'resize')
    .pipe(tap(() => setWindowWidth(window.innerWidth)))
    .subscribe();

  const {
    name,
    images,
    vendor,
    price,
    attributes,
    detailDescription,
    discount,
  } = details;
  const isOnSale = !!discount && Object.entries(discount).length > 0;

  const isLargeScreen = windowWidth >= 1024;

  const renderPrice = () => {
    if (!isOnSale)
      return (
        <Typography.Text style={{ marginBottom: 0, fontSize: '1.1rem' }}>
          <sup style={{ fontSize: '0.7rem' }}>
            {getSymbolFromCurrency(price.unit)}
          </sup>
          {price.amount.toLocaleString()}
        </Typography.Text>
      );

    return (
      <Row align="middle">
        <Typography.Text style={{ marginBottom: 0, fontSize: '1.1rem' }} mark>
          <sup style={{ fontSize: '0.7rem' }}>
            {getSymbolFromCurrency(price.unit)}
          </sup>
          {discount.modifiedPrice.toLocaleString()}
        </Typography.Text>

        <span
          style={{
            marginLeft: 5,
            fontSize: '0.6rem',
            textDecoration: 'line-through',
          }}
        >
          {getSymbolFromCurrency(price.unit)}
          {price.amount.toLocaleString()}
        </span>
      </Row>
    );
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12} xl={18}>
        {isLargeScreen ? (
          images.map((img) => (
            <Col key={img.id} xs={12}>
              <Image
                src={img.url}
                alt={`${name}_img_${img.id}`}
                style={{ width: '100%' }}
              />
            </Col>
          ))
        ) : (
          <Carousel>
            {images.map(({ url, id }) => (
              <Image src={url} key={id} alt={`${name}_img_${id}`} />
            ))}
          </Carousel>
        )}
      </Col>

      <Col xs={24} md={12} xl={6}>
        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              {name}
            </Typography.Title>
          </Col>

          <Col xs={24}>{renderPrice()}</Col>

          <Col xs={24} md={12}>
            <Button
              block
              size="large"
              type="primary"
              className={styles.btn}
              onClick={onCheckoutClick}
            >
              Buy this item
            </Button>
          </Col>
          <Col xs={24} md={12}>
            <Button
              block
              size="large"
              type="primary"
              className={styles.btn}
              onClick={onAddToCartClick}
            >
              Add to cart
            </Button>
          </Col>

          <Col xs={24}>
            <Row
              className={styles.subContainer}
              align="middle"
              gutter={8}
              style={{ margin: 0 }}
            >
              <Col xs={6} sm={4} md={6}>
                <img
                  src={vendor.logoUrl}
                  alt={vendor.name}
                  style={{ width: '100%' }}
                />
              </Col>

              <Col xs={18}>
                <Row gutter={[4, 4]}>
                  <Col xs={24}>
                    <Typography.Text strong>{vendor.name}</Typography.Text>
                  </Col>
                  <Col xs={24}>
                    <Button size="small" onClick={onViewVendorDetailsClick}>
                      View shop
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col xs={24}>
            <Descriptions
              title="Details"
              className={styles.subContainer}
              column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
            >
              {attributes.map((attr, index) => (
                <Descriptions.Item
                  label={attr.name}
                  key={generateKeyForArray(index)}
                >
                  {attr.value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Col>

          <Col xs={24}>
            <Row className={styles.subContainer}>
              <Col xs={24}>
                <Typography.Title level={5}>Description</Typography.Title>
              </Col>
              <Col xs={24}>{detailDescription}</Col>
            </Row>
          </Col>

          <Col xs={24}>
            <ReviewListManagement targetId={details.id} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
