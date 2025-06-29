import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { HttpBaseService } from '../http-base.service';
import { EnvironmentConfig } from '../../interfaces/app-configuration/environment-config';
import { SetApplicationParameterAsyncRequest } from '../../models/authentication/request/Admin/SetApplicationParameterAsyncRequest';
import { ENVIRONMENT_CONFIG_TOKEN } from '../../injection-tokens/environment-configuration/env-configuration-token';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);

  constructor(private http: HttpBaseService) {}

  public setInitTestUsers(token: string): Observable<any> {
    const url = this.config.ipecaApi.admin.setInitTestUsers;
    return this.http
      .post(url, null, this._getHttpOptions(token))
      .pipe(
        map((response: any) => response.data),
        catchError(this._handleError)
      );
  }

  public getApplicationParameterAsync(token: string): Observable<any> {
    const url = this.config.ipecaApi.admin.getApplicationParameterAsync;
    return this.http
      .get(url, this._getHttpOptions(token))
      .pipe(
        map((response: any) => response.data),
        catchError(this._handleError)
      );
  }

  public setApplicationParameterAsync(
    token: string,
    request: SetApplicationParameterAsyncRequest
  ): Observable<any> {
    const url = this.config.ipecaApi.admin.setApplicationParameterAsync;
    return this.http
      .post(url, request, this._getHttpOptions(token))
      .pipe(
        map((response: any) => response.data),
        catchError(this._handleError)
      );
  }

  private _getHttpOptions(token?: string): any {
    if (token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      };
    } else {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      };
    }
  }

  private _handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      alert(`${error.error.message}`);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
      alert(`${error.message}`);
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}
