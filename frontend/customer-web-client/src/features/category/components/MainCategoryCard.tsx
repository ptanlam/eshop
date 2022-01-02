import { Typography } from 'antd';
import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';
import { Category } from '../../../models/catalog';
import styles from './MainCategoryCard.module.css';

interface MainCategoryCardProps {
  category: Category;
  selected: boolean;
  onClick: (id: UniqueId, children: Category[]) => void;
}

export function MainCategoryCard({
  category,
  selected,
  onClick,
}: MainCategoryCardProps): ReactElement {
  const { id, name, images, children } = category;

  return (
    <motion.div
      onClick={() => onClick(id, children)}
      className={styles.container}
      whileTap={{ scale: 1.1 }}
      animate={{
        boxShadow: selected
          ? '0px 0px 3px rgba(0, 0, 0, 0.5)'
          : '0px 0px 0px rgba(0, 0, 0, 0)',
        backgroundColor: selected
          ? 'rgba(243, 119, 3, 0.801)'
          : 'rgba(0, 0, 0, 0)',
      }}
    >
      <div
        style={{ backgroundImage: `url(${images?.[0]?.url})` }}
        className={styles.img}
      ></div>
      <Typography.Paragraph
        className={styles.title}
        style={{ color: selected ? 'white' : '', marginBottom: 0 }}
        ellipsis={{ rows: 2 }}
      >
        {name}
      </Typography.Paragraph>
    </motion.div>
  );
}
