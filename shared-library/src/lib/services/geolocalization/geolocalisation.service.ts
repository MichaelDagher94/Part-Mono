import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpBaseService } from '../http-base.service';
import { EnvironmentConfig } from '../../interfaces/app-configuration/environment-config';
import { ENVIRONMENT_CONFIG_TOKEN } from '../../injection-tokens/environment-configuration/env-configuration-token';
import { IpecaResponseBase } from '../participant/participant.service';
import { TypeGeolocalisation } from "core.shared/Typescript/DTO/V1/Geolocalisation/typeGeolocalisation";
import { VilleGeolocalisationRequest } from "core.shared/Typescript/DTO/V1/Geolocalisation/villeGeolocalisationRequest";
import { GeolocalisationRequest } from "core.shared/Typescript/DTO/V1/Geolocalisation/geolocalisationRequest";
import { Geolocalisation } from "core.shared/Typescript/DTO/V1/Geolocalisation/geolocalisation";
import { HttpErrorMapper } from '../../utils/error-mapper/error-mapper.util';

@Injectable({ providedIn: 'root' })
export class GeolocalisationService {
  private readonly config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);

  constructor(private readonly http: HttpBaseService) {}

  fetchTypePs(): Observable<IpecaResponseBase<TypeGeolocalisation[]>> {
    return this.http
      .get<TypeGeolocalisation[]>(this.config.ipecaApi.geolocalisation.getTypePs)
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchTypePsHospitals(): Observable<IpecaResponseBase<TypeGeolocalisation[]>> {
    return this.http
      .get<TypeGeolocalisation[]>(
        this.config.ipecaApi.geolocalisation.getTypePsHospital
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  searchCities(
    dto: VilleGeolocalisationRequest
  ): Observable<IpecaResponseBase<string[]>> {
    return this.http
      .post<string[]>(this.config.ipecaApi.geolocalisation.getCities, dto)
      .pipe(catchError(HttpErrorMapper.map));
  }

  searchPositions(
    dto: GeolocalisationRequest
  ): Observable<IpecaResponseBase<Geolocalisation[]>> {
    return this.http
      .post<Geolocalisation[]>(
        this.config.ipecaApi.geolocalisation.getPosition,
        dto
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  searchFinesseCode(
    dto: GeolocalisationRequest
  ): Observable<IpecaResponseBase<Geolocalisation[]>> {
    return this.http
      .post<Geolocalisation[]>(
        this.config.ipecaApi.geolocalisation.searchcodefinesse,
        dto
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
}