import { Injectable, inject } from "@angular/core";
import {  Observable, catchError } from "rxjs";
import { ENVIRONMENT_CONFIG_TOKEN } from "../../injection-tokens/environment-configuration/env-configuration-token";
import { EnvironmentConfig } from "../../interfaces/app-configuration/environment-config";
import { HttpBaseService } from "../http-base.service";
import { IpecaResponseBase } from "../participant/participant.service";
import { TP_CarteAssure } from 'core.shared/Typescript/DTO/V1/CaptainWallet/tP_CarteAssure';                 
import { DOC_Document_T } from 'core.shared/Typescript/DTO/V1/Document/dOC_Document_T';                       
import { TiersPayantRequest } from 'core.shared/Typescript/DTO/V1/TiersPayant/tiersPayantRequest';            
import { DocumentRequest }  from 'core.shared/Typescript/DTO/V1/Participant/documentRequest';
import { HttpErrorMapper } from "../../utils/error-mapper/error-mapper.util";


@Injectable({ providedIn: 'root' })
export class TpCardsService {
  private readonly http   = inject(HttpBaseService);
  private readonly config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);

  fetchTiersPayantList(
    payload: TiersPayantRequest
  ): Observable<IpecaResponseBase<TP_CarteAssure[]>> {
    return this.http
      .post<TP_CarteAssure[]>(
        this.config.ipecaApi.tierspayant.tierspayantlist,
        payload
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchTpDocument(
    payload: DocumentRequest
  ): Observable<IpecaResponseBase<DOC_Document_T>> {
    return this.http
      .post<DOC_Document_T>(
        this.config.ipecaApi.tierspayant.tierspayantdocument,
        payload
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
}