import { Injectable, inject } from "@angular/core";
import {  Observable, catchError } from "rxjs";
import { ENVIRONMENT_CONFIG_TOKEN } from "../../injection-tokens/environment-configuration/env-configuration-token";
import { EnvironmentConfig } from "../../interfaces/app-configuration/environment-config";
import { HttpBaseService } from "../http-base.service";
import { IpecaResponseBase } from "../participant/participant.service";
import { OFF_Perimeter_T_Request }   from 'core.shared/Typescript/DTO/V1/offre/OFF_Perimeter_T_Request';
import { OFF_Offre_T }   from 'core.shared/Typescript/DTO/V1/offre/OFF_Offre_T';
import { HttpErrorMapper } from "../../utils/error-mapper/error-mapper.util";


@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly http   = inject(HttpBaseService);
  private readonly config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);


  fetchCustomOffers(
    payload: OFF_Perimeter_T_Request,
  ): Observable<IpecaResponseBase<OFF_Offre_T[]>> {
    return this.http
      .post<OFF_Offre_T[]>(
        this.config.ipecaApi.offre.getListeOffresPersonnalisees,
        payload,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
}