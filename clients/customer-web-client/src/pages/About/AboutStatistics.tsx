import Statistic from 'antd/lib/statistic';
import React, { ReactElement } from 'react';

interface AboutStatisticsProps {
  icon: ReactElement;
  title: string;
  value: number;
}

export function AboutStatistics({
  icon,
  title,
  value,
}: AboutStatisticsProps): ReactElement {
  return <Statistic title={title} value={value} prefix={icon} />;
}
