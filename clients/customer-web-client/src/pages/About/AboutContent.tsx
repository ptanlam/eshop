import { Typography } from 'antd';
import React, { ReactElement } from 'react';
import styles from './AboutContent.module.css';

export function AboutContent(): ReactElement {
  return (
    <>
      <h4 className={styles.subtitle}>The story behind</h4>
      <Typography.Paragraph className={styles.paragraph}>
        At Medisene, we deliver wellness on your terms because we believe that
        you should never have to compromise on the health, wellness, baby and
        beauty products you choose for yourself and your loved ones. That’s why
        we offer a broad selection of carefully curated, peer-reviewed products,
        all available online and delivered right to your door. It’s because we
        know that choice matters.
      </Typography.Paragraph>

      <Typography.Paragraph className={styles.paragraph}>
        With over 40,000 products and Canada’s largest assortment of green &
        natural brands (plus all of your familiar favourites), we make it easy
        to make choices you can trust. We deliver a quick, convenient, and
        hassle-free shopping experience, because we listen and we know what
        matters to you.
      </Typography.Paragraph>
    </>
  );
}
