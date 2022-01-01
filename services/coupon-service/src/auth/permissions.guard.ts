import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!routePermissions) {
      return true;
    }

    const userPermissions = context.getArgs()[0].user.permissions;

    const hasPermission = () =>
      routePermissions.every((routePermission) => {
        return userPermissions.includes(routePermission);
      });
    return hasPermission();
  }
}
