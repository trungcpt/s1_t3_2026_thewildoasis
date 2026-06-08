import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Public } from '../../../app/auth/auth.decorator';

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const [isPublicHandler, isPubicClass] =
      this.reflector.getAllAndMerge<boolean>(Public(), [
        context.getHandler(),
        context.getClass(),
      ]);
    if (isPublicHandler || isPubicClass) {
      return true;
    }
    const isValid = false;
    return isValid;
  }
}
