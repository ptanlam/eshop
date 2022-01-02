import { useAuth0 } from '@auth0/auth0-react';
import React, { ReactElement } from 'react';
import { useUserData } from '../../../hooks';

export function AuthGreetingText(): ReactElement {
  const { isAuthenticated } = useAuth0();
  const { user } = useUserData();

  return (
    <>
      {isAuthenticated ? `Welcome back, ${user?.nickname}` : 'Welcome, Guest'}
    </>
  );
}
