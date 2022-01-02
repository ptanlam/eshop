import { Col, Row, Typography } from 'antd';
import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';
import styles from './AboutFeature.module.css';

interface AboutFeatureProps {
  icon: ReactElement;
  label: string;
  content: string;
}

export function AboutFeature({
  label,
  content,
  icon,
}: AboutFeatureProps): ReactElement {
  return (
    <motion.div className={styles.container}>
      <Row align="middle" gutter={[6, 6]}>
        <Col xs={24} className={styles.icon}>
          {icon}
        </Col>

        <Col xs={24}>
          <Typography.Title
            level={5}
            className={styles.title}
            style={{ margin: 0 }}
          >
            {label}
          </Typography.Title>
          <Typography.Paragraph
            className={styles.paragraph}
            style={{ margin: 0 }}
          >
            {content}
          </Typography.Paragraph>
        </Col>
      </Row>
    </motion.div>
  );
}
