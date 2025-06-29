import { Injectable, inject } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError, switchMap, catchError, EMPTY, tap } from "rxjs";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { Router } from "@angular/router";
import { AUTHENTICATION_FACADE_CONFIGURATION_TOKEN } from "../../../injection-tokens/authentication-facade-configuration/authentication-facade-configuration-token";
import { IAuthenticationFacadeService } from "../../../interfaces/authentication/iauthentication-facade.service";
import { ENVIRONMENT_CONFIG_TOKEN } from "../../../injection-tokens/environment-configuration/env-configuration-token";
import { EnvironmentConfig } from "../../../interfaces/app-configuration/environment-config";

@Injectable()
export class CookieInterceptor implements HttpInterceptor {
  private authService = inject(AuthenticationService);
  private csrfToken: string | null = null;
  private router = inject(Router);
  private authFacade = inject<IAuthenticationFacadeService>(AUTHENTICATION_FACADE_CONFIGURATION_TOKEN);
  private config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('[CookieInterceptor] Intercepting request:', request);

    const skipCsrfToken = request.method === 'GET' || request.url.includes('getCsrfTokenCookie');

    let modifiedRequest = request.clone({
      withCredentials: true,
      setHeaders: {
        'X-Client-Type': 'AngularWeb',
        'X-Auth-Method': 'Cookies'
      }
    });

    if (this.csrfToken && !skipCsrfToken) {
      modifiedRequest = modifiedRequest.clone({
        setHeaders: {
          'X-XSRF-TOKEN': this.csrfToken
        }
      });
    }

    if (request.url.includes('getCsrfTokenCookie')) {
      return next.handle(modifiedRequest).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.body?.token) {
            this.csrfToken = event.body.token;
            console.log('[CookieInterceptor] Updated CSRF token');
          }
        }),
        catchError((error) => throwError(() => error))
      );
    }

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !request.url.includes(this.config.ipecaApi.auth.refresh)) { // Avoid recursion on refresh itself
          return this.handle401Error(modifiedRequest, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    originalRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[CookieInterceptor] handle 401 Error:', originalRequest);
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        const needsCsrfRetry = !(originalRequest.method === 'GET' || originalRequest.url.includes('getCsrfTokenCookie'));
        if (this.csrfToken && needsCsrfRetry) {
          return this.authService.getCsrfToken().pipe(
            tap(response => {
              if (response && response.token) {
                this.csrfToken = response.token;
              } else {
                console.warn('[CookieInterceptor] CSRF token not returned from getCsrfToken after refresh.');
              }
            }),
            switchMap(() => next.handle(originalRequest.clone())), // Clone to ensure interceptor re-runs header logic
            catchError(csrfRefreshOrRetryError => {
              console.error('[CookieInterceptor] Retrying request after CSRF refresh failed:', csrfRefreshOrRetryError);
              return this.redirectToLogin();
            })
          );
        }
        return next.handle(originalRequest.clone()); // Clone to ensure interceptor re-runs header logic
      }),
      catchError(refreshError => {
        console.error('[CookieInterceptor] Cookie-based token refresh process failed:', refreshError);
        return this.redirectToLogin();
      })
    );
  }

  private redirectToLogin(): Observable<HttpEvent<any>> {
    console.log('[CookieInterceptor] Redirecting to login due to unrecoverable auth error.');
    const loginAppUrl = this.config.ipecaWebsite['login-app'];
    if (loginAppUrl) {
      window.location.href = loginAppUrl.replace(/\/+$/, '');
    } else {
      console.error('[CookieInterceptor] Login app URL not configured.');
    }
    return EMPTY;
  }
}