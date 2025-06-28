import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentService } from "../../../../../../../../../shared-library/src/lib/services/document/document.service";
import { FileUploadService } from "../../../../../../../../../shared-library/src/lib/services/file-upload/file-upload.service";

@Injectable({
  providedIn: "root",
})
export class DocumentFacadeService {
  documentService = inject(DocumentService);
  private fileUploadService = inject(FileUploadService);

  constructor() {}

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
