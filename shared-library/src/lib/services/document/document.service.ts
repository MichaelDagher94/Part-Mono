import { inject, Injectable } from "@angular/core";
import { EnvironmentConfig } from "../../interfaces/app-configuration/environment-config";
import { HttpBaseService } from "../http-base.service";
import { catchError, Observable, throwError } from "rxjs";
import { ENVIRONMENT_CONFIG_TOKEN } from "../../injection-tokens/environment-configuration/env-configuration-token";
import { IpecaResponseBase } from "../participant/participant.service";
import { PDF_Request } from "core.shared/Typescript/DTO/V1/Document/pDF_Request"
import { DOC_Perimeter_T_Request } from "core.shared/Typescript/DTO/V1/Document/dOC_Perimeter_T_Request"
import { EpticaRequest  } from "core.shared/Typescript/DTO/V1/Eptica/epticaRequest"
import { DOC_Document_T   } from "core.shared/Typescript/DTO/V1/Document/dOC_Document_T"
import { HttpErrorMapper } from "../../utils/error-mapper/error-mapper.util";

 
export interface PersonalDocDto {
  id: string;
  title: string;
  url: string;
  created: string;
}

export interface SubmitDocResponseDto {
  success: boolean;
  documentId?: string;
}
@Injectable({
  providedIn: "root",
})
export class DocumentService {
  
  private config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);
  private http=inject(HttpBaseService)

  fetchPdfList(
    request: PDF_Request
  ): Observable<IpecaResponseBase<DOC_Document_T[]>> {
    return this.http
      .post<DOC_Document_T[]>(
        this.config.ipecaApi.document.getListePdfs,
        request
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
  fetchPersonalDocs(
    request: DOC_Perimeter_T_Request 
  ): Observable<IpecaResponseBase<PersonalDocDto[]>> {
    return this.http
      .post<PersonalDocDto[]>(
        this.config.ipecaApi.document.getListeDocumentsPersonnalisees,
        request
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
  
}
