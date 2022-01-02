import { Button } from 'antd';
import React, { ReactElement } from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: ReactElement;
  onClick?: () => void;
  loading?: boolean;
}

export function IconButton({
  icon,
  onClick,
  loading,
}: IconButtonProps): ReactElement {
  return (
    <Button
      shape="circle"
      size="large"
      type="text"
      className={styles.icon}
      icon={icon}
      onClick={onClick}
      loading={!!loading}
    ></Button>
  );
}
