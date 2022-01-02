import { useAuth0 } from '@auth0/auth0-react';
import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../../constants';
import { generateKeyForArray } from '../../utils';
import styles from './Navigation.module.css';

export function Navigation(): ReactElement {
  const { isAuthenticated } = useAuth0();

  const visible = (authenticationRequired: boolean) =>
    !authenticationRequired || isAuthenticated;

  return (
    <nav className={styles.container}>
      {navItems
        .filter(({ name }) => !name.toLocaleLowerCase().includes('cart'))
        .map(
          ({ to, name, authenticationRequired }) =>
            visible(authenticationRequired) && (
              <NavLink
                to={to}
                className={styles.linkItem}
                key={generateKeyForArray(name)}
                activeStyle={{
                  color: 'black',
                }}
                exact={to === '/'}
              >
                {name}
              </NavLink>
            )
        )}
    </nav>
  );
}
