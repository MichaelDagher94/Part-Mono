import { inject, Injectable } from "@angular/core";
import { Observable, Subject, catchError } from "rxjs";
import { HttpBaseService } from "../http-base.service";
import { LoginRequest } from "../../models/authentication/request/Auth/LoginRequest";
import { EnvironmentConfig } from "../../interfaces/app-configuration/environment-config";
import { ENVIRONMENT_CONFIG_TOKEN } from "../../injection-tokens/environment-configuration/env-configuration-token";
import { AuthSessionBundle } from "../../utils/cookie-store";
import { IpecaResponseBase } from "../participant/participant.service";
import { TokenRequest } from "core.shared/Typescript/DTO/V1/Token/tokenRequest"
import { RefreshTokenResponse } from "core.shared/Typescript/DTO/V1/Token/refreshTokenResponse"
import { AuthResponse } from "core.shared/Typescript/DTO/V1/Auth/authResponse";
import { HttpErrorMapper } from "../../utils/error-mapper/error-mapper.util";

export interface CsrfTokenDto {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly sessionUpdated$ = new Subject<AuthSessionBundle | null>();

  private readonly config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);
  private readonly http = inject(HttpBaseService);

  login(req: LoginRequest): Observable<IpecaResponseBase<AuthResponse>> {
    return this.http
      .post<AuthResponse>(this.config.ipecaApi.auth.login, req)
      .pipe(catchError(HttpErrorMapper.map));
  }

  refreshToken(
    dto: TokenRequest
  ): Observable<IpecaResponseBase<RefreshTokenResponse>> {
    return this.http
      .post<RefreshTokenResponse>(this.config.ipecaApi.auth.refresh, dto)
      .pipe(catchError(HttpErrorMapper.map));
  }

  getCsrfToken(): Observable<IpecaResponseBase<CsrfTokenDto>> {
    const url = `${this.config.ipecaApi.baseUrlV1}token/getCsrfTokenCookie`;
    return this.http
      .get<CsrfTokenDto>(url)
      .pipe(catchError(HttpErrorMapper.map));
  }

  logout(): Observable<IpecaResponseBase<void>> {
    const url = `${this.config.ipecaApi.baseUrlV1}auth/logout`;
    return this.http
      .post<void>(url, {})
      .pipe(catchError(HttpErrorMapper.map));
  }
}