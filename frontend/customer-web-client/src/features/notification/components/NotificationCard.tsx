import { Space, Typography } from 'antd';
import React, { ReactElement } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Notification } from '../../../models/notification';
import styles from './NotificationCard.module.css';

interface NotificationCardProps {
  notification: Notification;
  onNotificationBeSeen: (id: string) => void;
}

const { Paragraph } = Typography;

export function NotificationCard({
  notification,
  onNotificationBeSeen,
}: NotificationCardProps): ReactElement {
  let { note, seen, sentAt, content, id } = notification;

  const onChange = (visible: boolean) => {
    if (!visible || seen) return;
    onNotificationBeSeen(id);
  };

  return (
    <Space
      direction="vertical"
      className={styles.container}
      style={{
        backgroundColor: seen ? 'transparent' : 'rgba(24, 144, 255, 0.07)',
      }}
    >
      <VisibilitySensor onChange={onChange}>
        <>
          <Space direction="vertical">
            <Paragraph
              ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
              style={{
                fontWeight: seen ? 400 : 500,
              }}
            >
              {content}
            </Paragraph>
          </Space>
          <p className={styles.note}>Note: {note}</p>
          <p className={styles.timestamp}>
            {new Date(sentAt).toLocaleString()}
          </p>
        </>
      </VisibilitySensor>
    </Space>
  );
}
