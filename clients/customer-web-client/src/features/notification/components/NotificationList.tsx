import { Empty } from 'antd';
import React, { ReactElement } from 'react';
import { Notification } from '../../../models/notification';
import { PaginationMeta } from '../../../models/shared';
import { generateKeyForArray } from '../../../utils';
import { NotificationCard } from './NotificationCard';
import styles from './NotificationList.module.css';

interface NotificationListProps {
  list: Array<Notification>;
  pagination: PaginationMeta;
  fetchNext: () => void;
  onNotificationBeSeen: (id: string) => void;
}

export function NotificationList({
  list,
  fetchNext,
  pagination,
  onNotificationBeSeen,
}: NotificationListProps): ReactElement {
  const hasNotification = list.length > 0;

  return (
    <div className={styles.container}>
      {hasNotification ? (
        list.map((notification) => (
          <NotificationCard
            notification={notification}
            key={notification.id}
            onNotificationBeSeen={onNotificationBeSeen}
          />
        ))
      ) : (
        <div
          key={generateKeyForArray('nodata')}
          className={styles.empty}
          style={{ cursor: 'default' }}
        >
          <Empty description={<span>No notification</span>} />
        </div>
      )}
    </div>
  );
}
