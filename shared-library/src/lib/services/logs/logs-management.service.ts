import { inject, Injectable } from '@angular/core';
import { HttpBaseService } from '../http-base.service';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, throwError, Observable } from 'rxjs';
import { LogEntry } from '../../models/logs';
import { EnvironmentConfig } from '../../interfaces/app-configuration/environment-config';
import { ENVIRONMENT_CONFIG_TOKEN } from '../../injection-tokens/environment-configuration/env-configuration-token';

// logs-management.service.ts
@Injectable({
  providedIn: 'root'
})
export class LogsManagementService {
  private config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);

  constructor(private http: HttpBaseService) {}

  public fetchLogs(token: string, queryParams?: Record<string, string>): Observable<LogEntry[]> {
    let url = this.config.ipecaApi.logs.getAll;
    if (queryParams) {
      const qs = new URLSearchParams(queryParams).toString();
      if (qs) {
        url += `?${qs}`;
      }
    }

    return this.http.get(url, this._getHttpOptions(token))
      .pipe(
        map((response: unknown) => response as LogEntry[]),
        catchError(this._handleError)
      );
  }

  private _getHttpOptions(token?: string): any {
    if (token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        })
      };
    } else {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    }
  }

  private _handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}