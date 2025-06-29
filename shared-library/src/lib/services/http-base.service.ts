import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IpecaResponseBase } from './participant/participant.service';
export interface JsonHttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  observe?: 'body';       
  responseType?: 'json';   
}
@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {
  constructor(private http: HttpClient) {
  }
  
  get<T = unknown>(
    url: string,
    options: JsonHttpOptions = {}
  ): Observable<IpecaResponseBase<T>> {
    return this.http.get<IpecaResponseBase<T>>(url, options);
  }
  
  post<T = unknown>(
    url: string,
    data: unknown,
    options: JsonHttpOptions = {}
  ): Observable<IpecaResponseBase<T>> {
    return this.http.post<IpecaResponseBase<T>>(url, data, options);
  }
}
