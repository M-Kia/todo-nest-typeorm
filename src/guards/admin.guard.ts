import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    return request.currentUser.isAdmin;
  }
}
