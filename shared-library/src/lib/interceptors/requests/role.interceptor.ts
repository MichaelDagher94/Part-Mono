import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentConfig } from '../../interfaces/app-configuration/environment-config';
import { ENVIRONMENT_CONFIG_TOKEN } from '../../injection-tokens/environment-configuration/env-configuration-token';

@Injectable()
export class RoleInterceptor implements HttpInterceptor {
  private config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const role = this.config.role;

    const modifiedRequest = request.clone({
      setHeaders: {
        'X-User-Role': role
      }
    });

    return next.handle(modifiedRequest);
  }
}
