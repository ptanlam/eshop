import { useAuth0, User } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { filter, from, mergeMap, of, tap } from 'rxjs';

export function useUserData() {
  const { getIdTokenClaims, isAuthenticated, isLoading, user } = useAuth0();
  const [userData, setUserData] = useState<{
    accessToken: string;
    user?: User;
  }>({ accessToken: '' });

  useEffect(() => {
    of(true)
      .pipe(
        filter(() => isAuthenticated && !isLoading),
        mergeMap(() =>
          from(getIdTokenClaims()).pipe(
            tap(({ __raw }) =>
              setUserData((prev) => ({
                ...prev,
                accessToken: __raw,
                user,
              }))
            )
          )
        )
      )
      .subscribe();
  }, [getIdTokenClaims, isAuthenticated, user, isLoading]);

  return userData;
}
