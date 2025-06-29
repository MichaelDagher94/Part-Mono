import { inject, Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { HttpBaseService } from "../http-base.service";
import { EnvironmentConfig } from "../../interfaces/app-configuration/environment-config";
import { ENVIRONMENT_CONFIG_TOKEN } from "../../injection-tokens/environment-configuration/env-configuration-token";
import { Participant } from 'core.shared/Typescript/DTO/V1/Participant/participant';
import { Consentements } from 'core.shared/Typescript/DTO/V1/Participant/consentements';
import { AttestationAffiliation } from 'core.shared/Typescript/DTO/V1/Participant/attestationAffiliation';
import { ReleveSituation } from 'core.shared/Typescript/DTO/V1/Participant/releveSituation';
import { DocumentAppelCotisation } from 'core.shared/Typescript/DTO/V1/Participant/documentAppelCotisation';
import { DesignationBeneficiaireDeces } from "core.shared/Typescript/DTO/V1/Participant/designationBeneficiaireDeces";
import { ChoixOptionDeces } from "core.shared/Typescript/DTO/V1/Participant/choixOptionDeces";
import { Notices } from "core.shared/Typescript/DTO/V1/Participant/notices";
import { Pays } from 'core.shared/Typescript/DTO/V1/Participant/pays';
import { ParticipantRequest } from 'core.shared/Typescript/DTO/V1/Participant/participantRequest';
import { CoordonneeParticipantRequest } from 'core.shared/Typescript/DTO/V1/Participant/coordonneeParticipantRequest';
import { ParticipantBanque } from "core.shared/Typescript/DTO/V1/Participant/participantBanque";
import { ConsentementRequest } from 'core.shared/Typescript/DTO/V1/Participant/consentementRequest';
import { ChoixAirbusRequest } from 'core.shared/Typescript/DTO/V1/Participant/choixAirbusRequest';
import { ChoixAirbus } from 'core.shared/Typescript/DTO/V1/Participant/choixAirbus';
import { HttpErrorMapper } from "../../utils/error-mapper/error-mapper.util";
import { NoticeParticipant } from "core.shared/Typescript/DTO/V1/Participant/noticeParticipant";
import { ServicesRequest } from "core.shared/Typescript/DTO/V1/Participant/servicesRequest";
import { NoticeRequest } from "core.shared/Typescript/DTO/V1/Participant/noticeRequest";
import { Devis } from 'core.shared/Typescript/DTO/V1/Participant/devis';
import { PecHospiRequest } from 'core.shared/Typescript/DTO/V1/Participant/pecHospiRequest';
import { PecHospi } from 'core.shared/Typescript/DTO/V1/Participant/pecHospi';

export interface IpecaResponseBase<T> {
  isSuccess: boolean;
  errorMessage?: string | null;
  errorCode: number;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly cfg = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);

  constructor(private readonly http: HttpBaseService) {}

  fetchMe(): Observable<IpecaResponseBase<Participant>> {
    return this.http
      .get<Participant>(this.cfg.ipecaApi.participant.me)
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchConsentList(
    participantNumber: string
  ): Observable<IpecaResponseBase<Consentements[]>> {
    return this.http
      .post<Consentements[]>(
        this.cfg.ipecaApi.participant.getConsentList,
        { numParticipant: participantNumber }
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchConsentInfo(): Observable<IpecaResponseBase<Consentements[]>> {
    return this.http
      .get<Consentements[]>(this.cfg.ipecaApi.participant.getConsentInfo)
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchAffiliationCertificate(
    participantNumber: string
  ): Observable<IpecaResponseBase<AttestationAffiliation>> {
    return this.http
      .post<AttestationAffiliation>(
        this.cfg.ipecaApi.participant.getAffiliationCertificate,
        { numParticipant: participantNumber }
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchAllNotices(
    payload: ServicesRequest
  ): Observable<IpecaResponseBase<NoticeParticipant[]>> {
    return this.http
      .post<NoticeParticipant[]>(
        this.cfg.ipecaApi.participant.allnotices,
        payload
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchNoticeFile(
    payload: NoticeRequest
  ): Observable<IpecaResponseBase<Notices>> {
    return this.http
      .post<Notices>(
        this.cfg.ipecaApi.participant.getnoticefile,
        payload
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchStatusReport(
    participantNumber: string
  ): Observable<IpecaResponseBase<ReleveSituation>> {
    return this.http
      .post<ReleveSituation>(
        this.cfg.ipecaApi.participant.getStatusReport,
        { numParticipant: participantNumber }
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchContributionAppealFile(
    participantNumber: string
  ): Observable<IpecaResponseBase<DocumentAppelCotisation>> {
    return this.http
      .post<DocumentAppelCotisation>(
        this.cfg.ipecaApi.participant.getContributionAppealFile,
        { numParticipant: participantNumber }
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchCountries(): Observable<IpecaResponseBase<Pays[]>> {
    return this.http
      .get<Pays[]>(this.cfg.ipecaApi.participant.getcountries)
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchAirbusContractChoice(): Observable<IpecaResponseBase<ChoixAirbus>> {
    return this.http
      .get<ChoixAirbus>(this.cfg.ipecaApi.participant.getchoixcontratairbus)
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchDeathBeneficiaryDesignation(
    payload: ParticipantRequest
  ): Observable<IpecaResponseBase<DesignationBeneficiaireDeces>> {
    return this.http
      .post<DesignationBeneficiaireDeces>(
        this.cfg.ipecaApi.participant.GetDeathBeneficiaryDesignation,
        payload
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  fetchDeathOptionChoice(
    payload: ParticipantRequest
  ): Observable<IpecaResponseBase<ChoixOptionDeces>> {
    return this.http
      .post<ChoixOptionDeces>(
        this.cfg.ipecaApi.participant.GetDeathOptionChoiceFile,
        payload
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

 fetchDevisList(
    payload: ParticipantRequest
  ): Observable<IpecaResponseBase<Devis>> {
    return this.http
      .post<Devis>(this.cfg.ipecaApi.participant.quotesList, payload)
      .pipe(catchError(HttpErrorMapper.map));
  }

  savePecHospi(
    payload: PecHospiRequest
  ): Observable<IpecaResponseBase<PecHospi>> {
    return this.http
      .post<PecHospi>(this.cfg.ipecaApi.participant.setpechospi, payload)
      .pipe(catchError(HttpErrorMapper.map));
  }
  updateParticipantData(
    data: CoordonneeParticipantRequest
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(this.cfg.ipecaApi.participant.updateData, data)
      .pipe(catchError(HttpErrorMapper.map));
  }

  updateConsentList(
    payload: ConsentementRequest
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(this.cfg.ipecaApi.participant.updateConsent, payload)
      .pipe(catchError(HttpErrorMapper.map));
  }

  saveAirbusContractChoice(
    data: ChoixAirbusRequest
  ): Observable<IpecaResponseBase<ChoixAirbus>> {
    return this.http
      .post<ChoixAirbus>(
        this.cfg.ipecaApi.participant.insertchoixcontratairbus,
        data
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  emailExists(
    participant: ParticipantRequest
  ): Observable<IpecaResponseBase<boolean>> {
    return this.http
      .post<boolean>(
        this.cfg.ipecaApi.participant.emailexist,
        participant
      )
      .pipe(catchError(HttpErrorMapper.map));
  }

  updateEmail(
    data: ParticipantRequest
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(this.cfg.ipecaApi.participant.updateemail, data)
      .pipe(catchError(HttpErrorMapper.map));
  }

  updatePassword(
    payload: ParticipantRequest
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(this.cfg.ipecaApi.participant.updatepassword, payload)
      .pipe(catchError(HttpErrorMapper.map));
  }

  updateBankInfo(
    data: ParticipantBanque
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(this.cfg.ipecaApi.participant.updateBankInfo, data)
      .pipe(catchError(HttpErrorMapper.map));
  }

  validateCtrlIban(
    data: ParticipantRequest
  ): Observable<IpecaResponseBase<boolean>> {
    return this.http
      .post<boolean>(this.cfg.ipecaApi.participant.ctrlIban, data)
      .pipe(catchError(HttpErrorMapper.map));
  }

  findTrtIban(
    data: ParticipantRequest
  ): Observable<IpecaResponseBase<boolean>> {
    return this.http
      .post<boolean>(this.cfg.ipecaApi.participant.findtrtiban, data)
      .pipe(catchError(HttpErrorMapper.map));
  }

  persistIban(
    data: ParticipantRequest
  ): Observable<IpecaResponseBase<void>> {
    return this.http
      .post<void>(this.cfg.ipecaApi.participant.updateIban, data)
      .pipe(catchError(HttpErrorMapper.map));
  }

  
}