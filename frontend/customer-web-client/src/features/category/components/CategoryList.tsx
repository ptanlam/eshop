import { Col, Empty, Row } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { Category } from '../../../models/catalog';
import styles from './CategoryList.module.css';
import { MainCategoryCard } from './MainCategoryCard';
import { SubCategoryCard } from './SubCategoryCard';

interface CategoryListProps {
  list: Array<Category>;
}

export function CategoryList({ list }: CategoryListProps): ReactElement {
  const [selectedCategoryId, setSelectedCategoryId] = useState<UniqueId>('');
  const [subCategoryList, setSubCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    if (!list.length) return;
    setSelectedCategoryId(list[0].id);
    setSubCategoryList(list[0].children);
  }, [list]);

  const onMainCategoryClick = (id: UniqueId, children: Category[]) => {
    setSelectedCategoryId(id);
    setSubCategoryList(children);
  };

  return (
    <Row
      gutter={[16, 16]}
      justify="space-around"
      style={{ marginLeft: 0, marginRight: 0 }}
    >
      <Col xs={7} md={24} className={styles.mainCategoryListContainer}>
        <Row gutter={[8, 8]} justify="center">
          {list.map((category) => (
            <Col xs={24} md={3} lg={2} key={category.id}>
              <MainCategoryCard
                selected={selectedCategoryId === category.id}
                category={category}
                onClick={onMainCategoryClick}
                key={category.id}
              />
            </Col>
          ))}
        </Row>
      </Col>

      <Col xs={16} md={24} className={styles.subCategoryListContainer}>
        {subCategoryList.length ? (
          subCategoryList.map((category) => (
            <SubCategoryCard key={category.id} category={category} />
          ))
        ) : (
          <Empty
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            description=""
          />
        )}
      </Col>
    </Row>
  );
}
