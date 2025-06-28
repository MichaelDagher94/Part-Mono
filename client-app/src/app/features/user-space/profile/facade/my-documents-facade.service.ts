import { inject, Injectable } from "@angular/core";
import { DocumentService } from "../../../../../../../shared-library/src/lib/services/document/document.service";
import { catchError, of } from "rxjs";
import { ToastMessageService } from "../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FileUploadService } from "../../../../../../../shared-library/src/lib/services/file-upload/file-upload.service";
import { ParticipantFacadeService } from "../../../../core/services/participant-facade/participant-facade.service";
import { ParticipantService } from "../../../../../../../shared-library/src/lib/services/participant/participant.service";

@Injectable({
  providedIn: "root",
})
export class MyDocumentsFacadeService {
  documentService = inject(DocumentService);
  private readonly toast = inject(ToastMessageService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly participantService = inject(ParticipantService);

  constructor() {}

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

  /**
   *
   * @param data
   * @returns
   */
  updateIban(data: any) {
    return this.participantService.updateIban(data).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de mettre à jour les données");
        return of(null);
      })
    );
  }
  /**
   * Submit a document step
   */
  submitDocumentStep(payload: any) {
    return this.documentService.submitDocumentStepAsync(payload);
  }

  getListCustomDocs(data: any) {
    return this.documentService.getListePersonnalDocs(data).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }
}
