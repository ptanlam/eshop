import { Footer as AntFooter } from 'antd/lib/layout/layout';
import React, { ReactElement } from 'react';
import styles from './Footer.module.css';

export function Footer(): ReactElement {
  return (
    <>
      <AntFooter className={styles.container}>
        <h1 className={styles.title}>eShop</h1>
        <p className={styles.subtitle}>
          ©2021 Lorem ipsum dolor sit amet consectetur
        </p>
      </AntFooter>

      <p className={styles.purpose}>
        This website is created for <strong>learning purpose</strong> only.
      </p>
    </>
  );
}
