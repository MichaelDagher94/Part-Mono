import { inject, Injectable } from "@angular/core";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FileUploadService } from "../../../../../../../../shared-library/src/lib/services/file-upload/file-upload.service";
import { GeolocalisationService } from "../../../../../../../../shared-library/src/lib/services/geolocalisation/geolocalisation.service";
import { MyRefundService } from "../../../../../../../../shared-library/src/lib/services/my-refund/my-refund.service";
import { StepService } from "../../../../../../../../shared-library/src/lib/services/step/step-service.service";
import { EnuCorrespondance } from "../../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { catchError, Observable, of, switchMap, tap } from "rxjs";
import { ParticipantService } from "../../../../../../../../shared-library/src/lib/services/participant/participant.service";
import { DocumentService } from "../../../../../../../../shared-library/src/lib/services/document/document.service";

interface IpecaTypeDocumentRequest {
  Correspondances: number[];
}
@Injectable({
  providedIn: "root",
})
export class ClaimFacadeService {
  stepService = inject(StepService);
  refundService = inject(MyRefundService);
  geolocService = inject(GeolocalisationService);
  fileUpload = inject(FileUploadService);
  private participantService = inject(ParticipantService);
  private readonly toast = inject(ToastMessageService);
  documentService = inject(DocumentService);

  constructor() {}

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

  getFiles(sectionName: string) {
    return this.fileUpload.getFiles(sectionName);
  }

  clearFiles(sectionName: string) {
    return this.fileUpload.clear(sectionName);
  }

  getTypeDocumentAsync(
    ipecaCorrespondance: EnuCorrespondance
  ): Observable<any> {
    const request = {
      Correspondances: [ipecaCorrespondance as number],
    } as IpecaTypeDocumentRequest;

    return this.stepService.getTypeDocumentAsync(request).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }

  saveDocument(data: any): Observable<any> {
    const request = {
      Destination: data.destination,
      Comment: data.message || "",
      FormName: data.fromName,
      Subject: data.typeDocument,
      NumParticipant: data.participantNumber,
      LastName: data.lastName,
      FirstName: data.firstName,
      NumPlitg: "F001",
      NumDocg: "D001",
      Application: "EVOLIS",
      Email: data.email,
      HtmlBody: data.htmlBody,
      SocialSecurityNumber: data.socialSecurityNumber,
      Birthdate: data.birthDate,
      Vip: data.vip,
      Files: data.files,
      isSiteWeb: true,
    };
    return this.documentService.submitDocumentStepAsync(request);
  }
}
