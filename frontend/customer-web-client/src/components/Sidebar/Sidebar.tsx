import { useAuth0 } from '@auth0/auth0-react';
import { Drawer } from 'antd';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { navItems } from '../../constants';
import { AuthButton, AuthGreetingText } from '../../features/auth/components';
import { numberOfItemsInCartSelector } from '../../features/cart';
import { generateKeyForArray } from '../../utils';
import styles from './Sidebar.module.css';

interface SidebarProps {
  toggleDrawer: () => void;
  visible: boolean;
}

export function Sidebar({ toggleDrawer, visible }: SidebarProps): ReactElement {
  const { isAuthenticated } = useAuth0();
  const numberOfItemsInCart = useSelector(numberOfItemsInCartSelector);

  const itemVisible = (authenticationRequired: boolean) =>
    !authenticationRequired || isAuthenticated;

  return (
    <Drawer
      placement="right"
      zIndex={10000}
      width={300}
      title={<AuthGreetingText />}
      visible={visible}
      onClose={toggleDrawer}
      className={styles.drawer}
      extra={<AuthButton />}
    >
      <div className={styles.container}>
        <div className={styles.list}>
          {navItems.map(
            ({ icon, name, to, authenticationRequired }, index) =>
              itemVisible(authenticationRequired) && (
                <NavLink
                  to={to}
                  onClick={toggleDrawer}
                  key={generateKeyForArray(index)}
                >
                  <p className={styles.item}>
                    {icon}
                    {name}{' '}
                    {name.toLocaleLowerCase().includes('cart') &&
                      `(${numberOfItemsInCart})`}
                  </p>
                </NavLink>
              )
          )}
        </div>
      </div>
    </Drawer>
  );
}
