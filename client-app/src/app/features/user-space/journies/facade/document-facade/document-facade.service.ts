import { inject, Injectable } from "@angular/core";
import { DocumentService } from "../../../../../../../../shared-library/src/lib/services/document/document.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DocumentFacadeService {
  documentService = inject(DocumentService);

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

  submitDocument(data: any): Observable<any> {
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
      Files: data.files,
    };
    return this.documentService.submitDocumentStepAsync(request);
  }
}
