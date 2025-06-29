import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import {
  Observable,
  EMPTY,
  throwError,
  switchMap,
  catchError,
  tap,
  finalize
} from 'rxjs';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { LS_USER_TOKENS } from '../../../utils/storage.constants';
import { ENVIRONMENT_CONFIG_TOKEN } from '../../../injection-tokens/environment-configuration/env-configuration-token';
import { EnvironmentConfig } from '../../../interfaces/app-configuration/environment-config';
import { AUTHENTICATION_FACADE_CONFIGURATION_TOKEN } from '../../../injection-tokens/authentication-facade-configuration/authentication-facade-configuration-token';
import { IAuthenticationFacadeService } from '../../../interfaces/authentication/iauthentication-facade.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authFacade = inject<IAuthenticationFacadeService>(AUTHENTICATION_FACADE_CONFIGURATION_TOKEN);
  private authService = inject(AuthenticationService);
  private config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);
  private ts(): string {
    return new Date().toISOString();
  }

  private log(msg: string, ...args: any[]): void {
    console.log(`[TokenInterceptor ${this.ts()}] ${msg}`, ...args);
  }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getToken();

    let authRequest = request;

    const isRefreshCall = request.url === this.config.ipecaApi.auth.refresh;
    if (isRefreshCall) {
      const refreshToken = this.getRefreshToken();
      if (token && refreshToken) {
        this.log('→ Adding token & refreshToken to refresh payload');
        authRequest = authRequest.clone({
          body: { refreshToken }
        });
      }
    }

    /* ----------------------------------------------------------
     * 2. Standard Authorization header for every request
     * ---------------------------------------------------------- */
    if (token) {
      authRequest = authRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      this.log('NO token found – request will go out WITHOUT Authorization header');
    }

    return next.handle(authRequest).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          this.log('✔ response', { status: evt.status, url: evt.url });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        /* ---------------- 401 Handling ---------------- */
        if (error.status === 401) {
          this.log('401 detected – will attempt token refresh');
          return this.handle401Error(authRequest, next);
        }
        return throwError(() => error);
      }),
      finalize(() => this.log('↘ finished', request.url))
    );
  }

  /* ----------------------- 401 flow ------------------------------------- */
    private handle401Error(originalRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    this.log('handle401Error()', { token, refreshToken });

    if (!token || !refreshToken) {
      this.log('Either access or refresh token missing → redirect to /login');
      return this.redirectToLogin();
    }

    return this.authService.refreshToken().pipe(
      switchMap(({ userTokens }) => {
        const newToken = userTokens.accessToken;

        const retryReq = originalRequest.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` }
        });
        this.log('Retrying original request with NEW token…');

        return next.handle(retryReq);
      }),
      catchError(e => {
        this.log('Refresh also failed ❌ – user must login again', e);
        return this.redirectToLogin();
      })
    );
  }
  /* ---------------- localStorage helpers ------------------------------- */
  private getToken(): string | null {
    return this.authFacade.getAccessToken();                                 // new

  }

  private getRefreshToken(): string | null {
    return this.authFacade.getRefreshToken();                                 // new

  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(LS_USER_TOKENS, JSON.stringify({ accessToken, refreshToken }));
  }

  private redirectToLogin(): Observable<HttpEvent<any>> {
    window.location.href = 'http://localhost:4200'; // FIXME: externalise URL if needed
    return EMPTY;
  }
}