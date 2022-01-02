import { BellOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { Badge } from 'antd';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { filter, mergeMap, of, tap } from 'rxjs';
import { Dropdown } from '../../../components/Dropdown';
import { IconButton } from '../../../components/IconButton';
import { ApplicationContext } from '../../../contexts';
import { useUserData } from '../../../hooks';
import { Notification } from '../../../models/notification';
import { PaginationMeta } from '../../../models/shared';
import { NotificationList } from './NotificationList';

export function NotificationIconButton(): ReactElement {
  const { notificationService } = useContext(ApplicationContext);
  const { isAuthenticated } = useAuth0();
  const { accessToken, user } = useUserData();

  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    limit: 10,
    offset: 0,
    total: 0,
  });
  const [seenNotificationIdList, setSeenNotificationIdList] = useState<
    string[]
  >([]);

  useEffect(() => {
    const fetchNotificationList$ = of(true)
      .pipe(
        filter(() => isAuthenticated && !!user?.email),
        mergeMap(() =>
          notificationService!
            .fetchListForCustomer(10, 0, user!.email!, accessToken)
            .pipe(
              tap((response) => {
                setNotificationList(response.data);
                setPagination((prev) => ({ ...prev, ...response.pagination }));
              })
            )
        )
      )
      .subscribe();

    return () => fetchNotificationList$.unsubscribe();
  }, [notificationService, isAuthenticated, user, accessToken]);

  const onDropdownClose = () => {
    // TODO: mark notifications to be seen
    of(true)
      .pipe(
        filter(
          () =>
            isAuthenticated && !!user?.email && !!seenNotificationIdList.length
        ),
        mergeMap(() =>
          notificationService!
            .markListToBeSeen(seenNotificationIdList, accessToken)
            .pipe(
              tap(() => {
                setNotificationList((prev) => {
                  const newNotificationList = prev.map((n) => {
                    if (!seenNotificationIdList.some((i) => i === n.id))
                      return n;
                    return { ...n, seen: true };
                  });

                  return newNotificationList;
                });

                setSeenNotificationIdList([]);
              })
            )
        )
      )
      .subscribe();
  };

  const onNotificationBeSeen = (id: string) => {
    if (seenNotificationIdList.some((i) => i === id)) return;
    setSeenNotificationIdList((prev) => [...prev, id]);
  };

  const fetchNext = () => {
    console.log('hi');
  };

  return (
    <Dropdown
      onClose={onDropdownClose}
      overlayElement={
        <NotificationList
          list={notificationList}
          fetchNext={fetchNext}
          pagination={pagination}
          onNotificationBeSeen={onNotificationBeSeen}
        />
      }
    >
      <Badge
        color="blue"
        count={pagination.total}
        overflowCount={99}
        offset={[-5, 10]}
      >
        <IconButton icon={<BellOutlined />} />
      </Badge>
    </Dropdown>
  );
}
