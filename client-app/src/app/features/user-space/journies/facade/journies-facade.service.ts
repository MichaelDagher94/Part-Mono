import { inject, Injectable } from "@angular/core";
import { StepService } from "../../../../../../../shared-library/src/lib/services/step/step-service.service";
// import { EnuCorrespondance } from "core.shared/Typescript/Enumerations/V1/enuCorrespondance";
import { catchError, Observable, of } from "rxjs";
import { MyRefundService } from "../../../../../../../shared-library/src/lib/services/my-refund/my-refund.service";
import { GeolocalisationService } from "../../../../../../../shared-library/src/lib/services/geolocalisation/geolocalisation.service";
import { FileUploadService } from "../../../../../../../shared-library/src/lib/services/file-upload/file-upload.service";
import { ToastMessageService } from "../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { IGeolocalisationModel } from "../../../../../../../shared-library/src/lib/interfaces/geolocalisation/IGeolocalisation.interface";
import { EnuCorrespondance } from "../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
// import { EnuCorrespondance } from "core.shared/Typescript/Enumerations/V1/enuCorrespondance";

interface IpecaTypeDocumentRequest {
  Correspondances: number[];
}
@Injectable({
  providedIn: "root",
})
export class JourniesFacadeService {
  stepService = inject(StepService);
  refundService = inject(MyRefundService);
  geolocService = inject(GeolocalisationService);
  fileUpload = inject(FileUploadService);
  private readonly toast = inject(ToastMessageService);

  constructor() {}

  getFiles(sectionName: string) {
    return this.fileUpload.getFiles(sectionName);
  }

  clearFiles(sectionName: string) {
    return this.fileUpload.clear(sectionName);
  }

  getAllCities() {
    return this.geolocService.findCities();
  }

  getLocalisationByCodeFiness(codeFiness: string) {
    if (!codeFiness) return;
    const payload: IGeolocalisationModel = {
      ville: "",
      numeroParticipant: "",
      adresse: "",
      typePS: "",
      codeFinesse: codeFiness,
      isSiteWeb: true,
      platform: "",
      browser: "",
      engine: ",",
    };
    return this.geolocService.searchcodefinesse(payload).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }

  getLocalisationByCity(city: string) {
    if (!city) return;
    const payload: IGeolocalisationModel = {
      ville: city,
      numeroParticipant: "",
      adresse: "",
      typePS: "",
      codeFinesse: "",
      isSiteWeb: true,
      platform: "",
      browser: "",
      engine: ",",
    };
    return this.geolocService.findByCity(payload).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
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

  GetParticipantQuotes(participantNumber: string): Observable<any> {
    return this.stepService.getParticipantListQuotes(participantNumber).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }

  saveHospitalCoverage(data: any) {
    return this.stepService.savePch(data);
  }

  download(expenseId: string, typeDocument: string) {
    return this.refundService
      .GetExpenseFileAsyncV2(expenseId, typeDocument)
      .pipe(
        catchError(err => {
          this.toast.danger("Erreur", "Impossible de charger les données");
          return of([]);
        })
      );
  }

  downloadBase64Pdf(
    base64Data: string,
    fileName: string = "document.pdf"
  ): void {
    if (!base64Data) {
      console.warn("Aucune donnée PDF à télécharger.");
      return;
    }

    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = Array.from(byteCharacters, char =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier PDF :", error);
    }
  }
}
