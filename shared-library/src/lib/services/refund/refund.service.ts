import { inject, Injectable } from "@angular/core";
import { EnvironmentConfig } from "../../interfaces/app-configuration/environment-config";
import { HttpBaseService } from "../http-base.service";
import { catchError, Observable, throwError } from "rxjs";

import { ENVIRONMENT_CONFIG_TOKEN } from "../../injection-tokens/environment-configuration/env-configuration-token";
import { IpecaResponseBase } from "../participant/participant.service";
import { RemboursementRequest } from "core.shared/Typescript/DTO/V1/Remboursement/remboursementRequest";
import {
  RemboursementSante,
} from "core.shared/Typescript/DTO/V1/Remboursement/remboursementSante";
import {
  RemboursementPrevoyanceRequest,
} from "core.shared/Typescript/DTO/V1/Remboursement/remboursementPrevoyanceRequest";
import {
  RemboursementPrevoyance,
} from "core.shared/Typescript/DTO/V1/Remboursement/remboursementPrevoyance";
import {
  RemboursementMultiCriteresRequest,
} from "core.shared/Typescript/DTO/V1/Remboursement/remboursementMultiCriteresRequest";
import {
  DocumentRequest,
} from "core.shared/Typescript/DTO/V1/Participant/documentRequest";
import { HttpErrorMapper } from "../../utils/error-mapper/error-mapper.util";



export interface CareOriginDto {
  id: number;
  label: string;
}


export interface ExpenseFileDto {
  fileName: string;
  mimeType: string;
  base64: string;
}
@Injectable({
  providedIn: "root",
})
export class RefundService {
  private readonly http = inject(HttpBaseService);
  private readonly config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);

  fetchHealthRefunds(
    payload: RemboursementRequest,
  ): Observable<IpecaResponseBase<RemboursementSante[]>> {
    return this.http
      .post<RemboursementSante[]>(
        this.config.ipecaApi.remboursement.remboursementssante,
        payload,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchCareOrigins(): Observable<IpecaResponseBase<CareOriginDto[]>> {
    return this.http
      .get<CareOriginDto[]>(this.config.ipecaApi.remboursement.careorigin)
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchForesightRefunds(
    payload: RemboursementPrevoyanceRequest,
  ): Observable<IpecaResponseBase<RemboursementPrevoyance[]>> {
    return this.http
      .post<RemboursementPrevoyance[]>(
        this.config.ipecaApi.remboursement.foresightRefund,
        payload,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  /** Multi-criteria search on santé refunds */
  searchRefunds(
    criteria: RemboursementMultiCriteresRequest,
  ): Observable<IpecaResponseBase<RemboursementSante[]>> {
    return this.http
      .post<RemboursementSante[]>(
        this.config.ipecaApi.remboursement.searchMultiCriteria,
        criteria,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  /** Date-range search on prévoya­nce refunds */
  searchForesightRefundsByDate(
    payload: RemboursementPrevoyanceRequest,
  ): Observable<IpecaResponseBase<RemboursementPrevoyance[]>> {
    return this.http
      .post<RemboursementPrevoyance[]>(
        this.config.ipecaApi.remboursement.searchForeSightByDate,
        payload,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  /** Download justificatif PDF (legacy V1) */
  downloadExpenseFile(
    payload: RemboursementRequest,
  ): Observable<IpecaResponseBase<ExpenseFileDto>> {
    return this.http
      .post<ExpenseFileDto>(
        this.config.ipecaApi.remboursement.download,
        payload,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  /** Download justificatif PDF (new V2) */
  downloadExpenseFileV2(
    payload: DocumentRequest,
  ): Observable<IpecaResponseBase<ExpenseFileDto>> {
    return this.http
      .post<ExpenseFileDto>(
        this.config.ipecaApi.remboursement.downloadv2,
        payload,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
}