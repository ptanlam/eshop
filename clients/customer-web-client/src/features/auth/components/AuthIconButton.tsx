import { UserOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import { Dropdown } from '../../../components/Dropdown';
import { IconButton } from '../../../components/IconButton';
import { AuthActionList } from './AuthActionList';
import styles from './AuthIconButton.module.css';

export function AuthIconButton(): ReactElement {
  return (
    <div className={styles.container}>
      <Dropdown overlayElement={<AuthActionList />}>
        <IconButton icon={<UserOutlined />} />
      </Dropdown>
    </div>
  );
}
