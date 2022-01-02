import {
  AimOutlined,
  BarChartOutlined,
  BookOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';
import React, { ReactElement } from 'react';
import image from '../../assets/desk-with-laptops.jpg';
import { generateKeyForArray } from '../../utils';
import styles from './About.module.css';
import { AboutContent } from './AboutContent';
import { AboutFeature } from './AboutFeature';
import { AboutStatistics } from './AboutStatistics';

const features = [
  {
    icon: <BookOutlined />,
    label: 'Our story',
    content:
      'Lorem ipsum dolor sit amet consectetur, ' +
      'adipisicing elit. Facere, doloremque nobis! ' +
      'Eos officiis est ipsum at, maxime deserunt sint provident nemo, ' +
      'amet cum error ipsam, accusantium delectus dignissimos beatae aperiam?',
  },
  {
    icon: <BarChartOutlined />,
    label: 'Our mission',
    content:
      'Lorem ipsum dolor sit amet consectetur, ' +
      'adipisicing elit. Facere, doloremque nobis! ' +
      'Eos officiis est ipsum at, maxime deserunt sint provident nemo, ' +
      'amet cum error ipsam, accusantium delectus dignissimos beatae aperiam?',
  },
  {
    icon: <AimOutlined />,
    label: 'Our vision',
    content:
      'Lorem ipsum dolor sit amet consectetur, ' +
      'adipisicing elit. Facere, doloremque nobis! ' +
      'Eos officiis est ipsum at, maxime deserunt sint provident nemo, ' +
      'amet cum error ipsam, accusantium delectus dignissimos beatae aperiam?',
  },
];

const statistics = [
  {
    title: 'Vendors',
    value: 123,
    icon: <HomeOutlined />,
  },
  {
    title: 'Global Customers',
    value: 25,
    icon: <UsergroupAddOutlined />,
  },
];

export function About(): ReactElement {
  return (
    <Row>
      <Col xs={24}>
        <h2 className={styles.title}>About us</h2>
      </Col>

      <Col xs={24}>
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <img src={image} alt="" className={styles.image} />
          </Col>

          <Col xs={24} xl={12}>
            <AboutContent />
          </Col>

          <Col xs={24}>
            <Row align="middle" justify="center" gutter={[8, 8]}>
              {features.map(({ icon, label, content }, index) => (
                <Col key={generateKeyForArray(index)} xs={16} xl={8}>
                  <AboutFeature icon={icon} label={label} content={content} />
                </Col>
              ))}
            </Row>
          </Col>

          <Col xs={24}>
            <Row align="middle" justify="center" gutter={[8, 8]}>
              {statistics.map(({ icon, title, value }, index) => (
                <Col xs={12} key={generateKeyForArray(index)}>
                  {/* TODO: decorate statistics */}
                  <AboutStatistics icon={icon} title={title} value={value} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
