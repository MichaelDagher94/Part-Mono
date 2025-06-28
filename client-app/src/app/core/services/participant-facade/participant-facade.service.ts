import { inject, Injectable } from "@angular/core";
import { ParticipantService } from "../../../../../../shared-library/src/lib/services/participant/participant.service";
import {
  tap,
  catchError,
  of,
  Observable,
  throwError,
  switchMap,
  map,
} from "rxjs";
import { TpCardsService } from "../../../../../../shared-library/src/lib/services/tp-cards/tp-cards.service";
import { ToastMessageService } from "../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FileUploadService } from "../../../../../../shared-library/src/lib/services/file-upload/file-upload.service";

@Injectable({
  providedIn: "root",
})
export class ParticipantFacadeService {
  private participantService = inject(ParticipantService);
  private tpCardService = inject(TpCardsService);
  private toast = inject(ToastMessageService);
  private fileUploadService = inject(FileUploadService);

  constructor() {}

  // downloadThirdPartyPayings(data: any) {
  //   return this.participantService.GetThirdPartyPayingsByAffiliationFileAsync(
  //     data
  //   );
  // }
  downloadThirdPartyPayings(data: any) {
    return this.tpCardService.getTPDocument(data).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }
  getAllTpList(data: any) {
    return this.tpCardService.getAllTiersPayantList(data).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }

  public getCurrentParticipant(reinitialise = false): Observable<any> {
    const session = localStorage.getItem("currentUser");
    if (session && !reinitialise) {
      return of(JSON.parse(session));
    } else {
      return this.initializeUserData().pipe(
        switchMap(() => {
          const refreshed = localStorage.getItem("currentUser");
          return of(refreshed ? JSON.parse(refreshed) : null);
        })
      );
    }
  }

  /**
   * Vérifie si la couverture santé est active.
   */
  isSante(): Observable<boolean> {
    return this.getCurrentParticipant().pipe(
      map(participant => participant?.couvertureSante === true)
    );
  }

  /**
   * Vérifie si la couverture prévoyance est active.
   */
  isPrevoyance(): Observable<boolean> {
    return this.getCurrentParticipant().pipe(
      map(
        participant =>
          participant?.couvertureArretTravail === true ||
          participant?.couvertureDeces === true
      )
    );
  }
  /**
   * Vérifie si le participant à un certificat // numero attestation.
   */
  hasCertificate(): Observable<boolean> {
    return this.getCurrentParticipant().pipe(
      map(participant => !!participant?.numAttestation) // Vérifie si numAttestation existe
    );
  }

  // Vérifie le code entreprise du participant
  getParticipantEnterpriseCode(): Observable<any> {
    return this.getCurrentParticipant().pipe(
      map(participant => participant?.codeAdherent?.slice(-6) || null),
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }

  // Vérifie si le participant a un échéancier de paiement
  hasPaymentSchedule(): Observable<boolean> {
    return this.getCurrentParticipant().pipe(
      map(participant => participant?.echeancierIndiv === true)
    );
  }

  // Vérifie si le participant a plusieurs RIB
  hasMultipleRib(): Observable<boolean> {
    return this.getCurrentParticipant().pipe(
      map(participant => participant?.multiRib === "1")
    );
  }

  // Vérifie si c'est la première connexion du participant
  isFirstConnection(): Observable<boolean> {
    return this.getCurrentParticipant().pipe(
      map(participant => participant?.premiereConnexion === true)
    );
  }

  // Vérifie si le participant est Airbus
  isParticipantAirbus(): Observable<boolean> {
    return this.getCurrentParticipant().pipe(
      map(participant => participant?.isAirbus === true)
    );
  }

  // Vérifie le code établissement du participant
  getParticipantEstablishmentCode(): Observable<string | null> {
    return this.getCurrentParticipant().pipe(
      map(participant => participant?.codeEtablissement || null)
    );
  }

  downloadCertificate(participantNumber: string) {
    return this.participantService.getAffiliationCertificateFile(
      participantNumber
    );
  }
  downloadStatusReport(participantNumber: string) {
    return this.participantService.getStatusReportFile(participantNumber);
  }
  downloadContributionAppealFile(participantNumber: string) {
    return this.participantService.getContributionAppealFile(participantNumber);
  }

  getConsentList(numeroParticipant: string) {
    return this.participantService.getConsentList(numeroParticipant);
  }

  updateConsentParticipant(data: any) {
    const payload = {
      consentements: data,
      isSiteWeb: true,
      platform: "",
      browser: "",
      engine: "",
    };
    return this.participantService.updateConsentList(payload);
  }

  getConsentInfo() {
    return this.participantService.getConsentInfo().pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }
  public getAllCountries() {
    return this.participantService.getCountries().pipe(
      catchError(err => {
        this.toast.danger(
          "Erreur",
          "Un problème technique empêche actuellement le bon fonctionnement de ce formulaire : veuillez réessayer ultérieurement."
        );
        return of([]);
      })
    );
  }

  public UpdateData(payload: any) {
    return this.participantService.updateData(payload);
  }

  public updateEmail(payload: any) {
    return this.participantService.checkIfEmailExist(payload).pipe(
      switchMap((response: any) => {
        return of({ ...response, source: "check" });
      }),
      catchError(error => {
        if (error.status === 400) {
          return this.participantService.updateEmail(payload).pipe(
            map((updateResponse: any) => ({
              ...updateResponse,
              source: "update",
            }))
          );
        }
        return throwError(() => error);
      })
    );
  }

  public updatePassword(payload: any) {
    return this.participantService.updatePassword(payload);
  }

  public updateBankInfo(payload: any) {
    return this.participantService.updateBankInfo(payload);
  }

  // Modifie initializeUserData pour retourner un Observable
  initializeUserData(): Observable<any> {
    const token = this.getToken() || "";
    return this.participantService.Me(token).pipe(
      tap(user => {
        if (user) {
          user.isSante = user.couvertureSante === true;
          user.isPrevoyance =
            user.couvertureArretTravail === true ||
            user.couvertureDeces === true;
          localStorage.setItem("currentUser", JSON.stringify(user));
        }
      }),
      catchError(err => of(null))
    );
  }

  private getToken(): string | null {
    try {
      const session = localStorage.getItem("session");
      if (!session) return null;

      const parsed = JSON.parse(session);
      return parsed.token;
    } catch (error) {
      return null;
    }
  }

  /**
   * fileUpload methods
   * @params section : string : name from the controller
   */
  getFiles(section: string) {
    return this.fileUploadService.getFiles(section);
  }

  clearFiles(section: string) {
    return this.fileUploadService.clear(section);
  }
}
