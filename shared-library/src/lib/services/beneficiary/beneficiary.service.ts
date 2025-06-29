import { inject, Injectable } from "@angular/core";
import { EnvironmentConfig } from "../../interfaces/app-configuration/environment-config";
import { HttpBaseService } from "../http-base.service";
import { catchError, Observable } from "rxjs";
import { ENVIRONMENT_CONFIG_TOKEN } from "../../injection-tokens/environment-configuration/env-configuration-token";
import { IpecaResponseBase } from "../participant/participant.service";
import { HttpErrorMapper } from "../../utils/error-mapper/error-mapper.util";

// Correct DTOs imported based on the C# Controller
import { ParticipantRequest } from "core.shared/Typescript/DTO/V1/Participant/participantRequest";
import { LeBeneficiaire } from "core.shared/Typescript/DTO/V1/Beneficiaire/leBeneficiaire";
import { BeneficiaireRequest } from "core.shared/Typescript/DTO/V1/Beneficiaire/beneficiaireRequest";
import { AddTempBeneficiaryRequest } from "core.shared/Typescript/DTO/V1/Beneficiaire/addTempBeneficiaryRequest";
import { AddTempBeneficiaryResponse } from "core.shared/Typescript/DTO/V1/Beneficiaire/addTempBeneficiaryResponse";
import { TiersPayantRequest } from "core.shared/Typescript/DTO/V1/TiersPayant/tiersPayantRequest";
import { Pdf } from "core.shared/Typescript/DTO/V1/Participant/pdf";
// import { EditTempBeneficiaryRequest } from "core.shared/Typescript/DTO/V1/Beneficiaire/editTempBeneficiaryRequest";
// import { EditTempBeneficiaryResponse } from "core.shared/Typescript/DTO/V1/Beneficiaire/editTempBeneficiaryResponse";


@Injectable({
  providedIn: 'root',
})
export class BeneficiaryService {

  private readonly config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);

  constructor(private readonly http: HttpBaseService) {}

  fetchMany(
    dto: ParticipantRequest,
  ): Observable<IpecaResponseBase<LeBeneficiaire[]>> {
    return this.http
      .post<LeBeneficiaire[]>(
        this.config.ipecaApi.beneficiary.beneficiaries,
        dto,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  create(
    dto: BeneficiaireRequest,
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(
        this.config.ipecaApi.beneficiary.addbeneficiary,
        dto,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }


  addTempBeneficiary(
    dto: AddTempBeneficiaryRequest
  ): Observable<IpecaResponseBase<AddTempBeneficiaryResponse>> {
    return this.http
      .post<AddTempBeneficiaryResponse>(
        this.config.ipecaApi.beneficiary.addTempbeneficiary,
        dto
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
  add(
    dto: BeneficiaireRequest,
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(
        this.config.ipecaApi.beneficiary.addbeneficiary,
        dto,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  /**
   * Edits an existing beneficiary.
   */
  edit(
    dto: BeneficiaireRequest,
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(
        this.config.ipecaApi.beneficiary.editbeneficiary,
        dto,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
  /**
   * Edits a temporary beneficiary.
   */
  // editTempBeneficiary(
  //   dto: EditTempBeneficiaryRequest
  // ): Observable<IpecaResponseBase<EditTempBeneficiaryResponse>> {
  //   return this.http
  //     .post<EditTempBeneficiaryResponse>(
  //       this.config.ipecaApi.beneficiary.edittempbeneficiaire,
  //       dto
  //     )
  //     .pipe(catchError(HttpErrorMapper.map));
  // }

  /**
   * Updates an existing beneficiary.
   */
  update(
    dto: BeneficiaireRequest,
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(
        this.config.ipecaApi.beneficiary.editbeneficiary,
        dto,
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
  fetchThirdPartyPayings(
    payload: TiersPayantRequest
  ): Observable<IpecaResponseBase<Pdf>> {
    return this.http
      .post<Pdf>(
        this.config.ipecaApi.beneficiary.getThirdPartyPayingsByAffiliation,
        payload
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
  remove(
    dto: BeneficiaireRequest,
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(
        this.config.ipecaApi.beneficiary.deletebeneficiary,
        dto,
      )
    .pipe(catchError(HttpErrorMapper.map));
  }
}