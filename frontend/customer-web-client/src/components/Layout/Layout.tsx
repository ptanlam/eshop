import { UpOutlined } from '@ant-design/icons';
import { BackTop, Layout as AntLayout } from 'antd';
import React, { ReactElement } from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';
import styles from './Layout.module.css';

interface LayoutProps {
  children?: React.ReactElement | React.ReactElement[];
}

const { Content } = AntLayout;

export function Layout({ children }: LayoutProps): ReactElement {
  return (
    <AntLayout className={styles.container}>
      <BackTop className={styles.backTop}>
        <UpOutlined style={{ color: 'whitesmoke' }} />
      </BackTop>
      <Header />
      <Content className={styles.contentContainer}>
        <div className={styles.content}>{children}</div>
      </Content>
      <Footer />
    </AntLayout>
  );
}
