import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';

export function AuthButton(): ReactElement {
  const {
    loginWithRedirect,
    isAuthenticated,
    logout,
    isLoading: isAuthenticating,
  } = useAuth0();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  const renderAuthIcon = () =>
    isAuthenticated ? <LogoutOutlined /> : <UserOutlined />;

  const renderAuthText = () => (isAuthenticated ? 'Logout' : 'Login - Join us');

  const isLargeScreen = windowWidth >= 1024;

  const onClick = () => {
    if (isAuthenticated) {
      logout();
      return;
    }
    loginWithRedirect();
  };

  return (
    <>
      {isLargeScreen ? (
        <Button
          size="large"
          onClick={onClick}
          type="primary"
          icon={renderAuthIcon()}
          block
          loading={isAuthenticating}
        >
          {renderAuthText()}
        </Button>
      ) : (
        <Button
          size="large"
          onClick={onClick}
          type="text"
          shape="circle"
          icon={renderAuthIcon()}
          block
          loading={isAuthenticating}
        ></Button>
      )}
    </>
  );
}
