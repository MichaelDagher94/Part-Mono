import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

export interface DomainError {
  status: number;
  message: string;
  details?: unknown;
}

export class HttpErrorMapper {
  static map(err: unknown): Observable<never> {
    let domain: DomainError;

    if (err instanceof HttpErrorResponse) {
      domain = {
        status: err.status,
        message: HttpErrorMapper.messageForStatus(err.status, err.error),
        details: err.error,
      };
    } else {
      domain = { status: 0, message: 'Unexpected error', details: err };
    }

    return throwError(() => domain);
  }

  private static messageForStatus(status: number, body: any): string {
    switch (status) {
      case 0:   return 'Network unreachable';
      case 400: return 'Bad request';
      case 401: return 'Authentication required';
      case 403: return 'Access denied';
      case 404: return 'Resource not found';
      case 500: return 'Server error';
      default:  return body?.message ?? `Error ${status}`;
    }
  }
}
