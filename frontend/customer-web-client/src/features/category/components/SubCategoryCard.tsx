import { Menu } from 'antd';
import { push } from 'connected-react-router';
import qs from 'qs';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Category } from '../../../models/catalog';
import { currencyUnitSelector } from '../../currency/currencySlice';

const { SubMenu, Item } = Menu;

interface SubCategoryCardProps {
  category: Category;
}

export function SubCategoryCard({
  category,
}: SubCategoryCardProps): ReactElement {
  const dispatch = useDispatch();
  const currencyUnit = useSelector(currencyUnitSelector);

  const { id, name, children } = category;
  const stillHasChildren = !!children?.length;

  const onClick = () => {
    // Fetch products in whole category
    // we have to clear the product list before fetching
    const query = {
      categoryId: id,
      unit: currencyUnit,
    };

    dispatch(push(`/products?${qs.stringify(query)}`));
  };

  const renderSubCategoryCard = () =>
    stillHasChildren ? (
      <SubMenu title={name} key={id}>
        {children.map((subCategory) => (
          <SubCategoryCard key={subCategory.id} category={subCategory} />
        ))}
      </SubMenu>
    ) : (
      <Item key={id} onClick={onClick}>
        {name}
      </Item>
    );

  return <Menu mode="inline">{renderSubCategoryCard()}</Menu>;
}
