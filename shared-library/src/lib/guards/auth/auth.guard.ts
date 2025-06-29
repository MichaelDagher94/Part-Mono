import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EnvironmentConfig } from '../../interfaces/app-configuration/environment-config';
import { IAuthenticationFacadeService } from '../../interfaces/authentication/iauthentication-facade.service';
import { AUTHENTICATION_FACADE_CONFIGURATION_TOKEN } from '../../injection-tokens/authentication-facade-configuration/authentication-facade-configuration-token';
import { ENVIRONMENT_CONFIG_TOKEN } from '../../injection-tokens/environment-configuration/env-configuration-token';
import { ParticipantService } from '../../services/participant/participant.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);
  private authFacade = inject<IAuthenticationFacadeService>(AUTHENTICATION_FACADE_CONFIGURATION_TOKEN);
  private participantService = inject(ParticipantService)
  constructor() {
    console.log(`[AuthGuard] Initializing. Cookie Mode: ${this.config.useCookies}`);
  }
canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data['roles'] as string[] | undefined;
    const appName = route.data['appName'] as 'admin' | 'client' | undefined;

    const currentUserInfo = this.authFacade.getCurrentUserInfo();
    if (currentUserInfo) {
      console.log('[AuthGuard] User info found in facade:', currentUserInfo);
      if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(currentUserInfo.role)) {
        console.log(`[AuthGuard] Role mismatch. Required: ${requiredRoles}, User has: ${currentUserInfo.role}`);
        return this.redirectToLogin(appName);
      }
      return true;
    }

    console.log('[AuthGuard] No user info in facade, attempting to validate server session via me()');
    return this.participantService.me().pipe(
      map(profile => {
        if (!profile || !profile.role) {
          console.log('[AuthGuard] me() call returned no profile or no role.');
          return this.redirectToLogin(appName);
        }
        console.log('[AuthGuard] Profile from me():', profile);
        if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
          console.log(`[AuthGuard] Role mismatch after me(). Required: ${requiredRoles}, User has: ${profile.role}`);
          return this.redirectToLogin(appName);
        }
        return true;
      }),
      catchError((error) => {
        console.error('[AuthGuard] Error during me() call:', error);
        return of(this.redirectToLogin(appName));
      })
    );
  }

  private redirectToLogin(appName?: 'admin' | 'client'): UrlTree {
    let loginAppUrl = this.config.ipecaWebsite['login-app'];
    if (!loginAppUrl) {
        console.error("[AuthGuard] Login app URL is not configured in environment config!");
        return this.router.parseUrl('/error-login-url-missing'); 
    }
    loginAppUrl = loginAppUrl.replace(/\/+$/, '');

    let redirectUrl = loginAppUrl;
    if (appName) {
        redirectUrl += `?fromApp=${appName}`;
    }
    
    console.log(`[AuthGuard] Redirecting to: ${redirectUrl}`);
    return this.router.parseUrl(redirectUrl.startsWith('/') ? redirectUrl : '/' + redirectUrl);
  }
}

