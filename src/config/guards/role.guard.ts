import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    if (!user || !user.role || !roles.includes(user.role)) {
      return false; 
    }

    if (user.isBlocked) {
      return false;
    }

    return true;
  }
}
