import {
  AppstoreOutlined,
  FileOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from '@ant-design/icons';

export const navItems = [
  {
    to: '/',
    name: 'Home',
    icon: <HomeOutlined />,
    authenticationRequired: false,
  },
  {
    to: '/categories',
    name: 'Categories',
    icon: <AppstoreOutlined />,
    authenticationRequired: false,
  },
  {
    to: '/cart?limit=10&offset=0',
    name: 'Cart',
    icon: <ShoppingCartOutlined />,
    authenticationRequired: false,
  },
  {
    to: '/orders?limit=10&offset=0',
    name: 'Your orders',
    icon: <ShoppingOutlined />,
    authenticationRequired: true,
  },
  {
    to: '/my-coupons?limit=10&offset=0',
    name: 'Your coupons',
    icon: <FileOutlined />,
    authenticationRequired: true,
  },
  {
    to: '/coupons?limit=10&offset=0',
    name: 'Coupons',
    icon: <FileOutlined />,
    authenticationRequired: true,
  },
  {
    to: '/about',
    name: 'About us',
    icon: <TeamOutlined />,
    authenticationRequired: false,
  },
];
