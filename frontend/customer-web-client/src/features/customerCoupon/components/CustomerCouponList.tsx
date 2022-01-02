import React, { ReactElement } from 'react';
import { InProgress } from '../../../components/InProgress';
import { Coupon } from '../../../models/coupon';

interface CouponListProps {
  list: Coupon[];
}

export function CustomerCouponList({ list }: CouponListProps): ReactElement {
  return <InProgress />;
}
