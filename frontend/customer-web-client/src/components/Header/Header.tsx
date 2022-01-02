import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { Header as AntHeader } from 'antd/lib/layout/layout';
import React, { ReactElement, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthIconButton } from '../../features/auth/components';
import { CartIconButton } from '../../features/cart/components';
import { NotificationIconButton } from '../../features/notification/components';
import { Search } from '../../pages/Search/Search';
import { IconButton } from '../IconButton';
import { Navigation } from '../Navigation';
import { Sidebar } from '../Sidebar';
import styles from './Header.module.css';

export function Header(): ReactElement {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <AntHeader id="navbar" className={styles.container}>
      <NavLink to="/">
        <div className={styles.logoContainer}>
          <h3 className={styles.logoText}>eShop</h3>
          <p className={styles.logoSubText}>
            enhance your <br />
            online shopping experience
          </p>
        </div>
      </NavLink>

      <Navigation />

      <div className={styles.actionsContainer}>
        <div>
          <IconButton icon={<SearchOutlined />} onClick={toggleSearch} />
          <Search visible={searchVisible} onClose={toggleSearch} />
        </div>
        <NotificationIconButton />

        <div className={styles.sidebarContainer}>
          <IconButton
            icon={<MenuOutlined id="drawer-icon" />}
            onClick={toggleSidebar}
          />
          <Sidebar toggleDrawer={toggleSidebar} visible={sidebarVisible} />
        </div>

        <CartIconButton />
        <AuthIconButton />
      </div>
    </AntHeader>
  );
}
