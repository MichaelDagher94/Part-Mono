import { inject, Injectable } from "@angular/core";
import { EnvironmentConfig } from "../../interfaces/app-configuration/environment-config";
import { HttpBaseService } from "../http-base.service";
import { catchError, map, Observable, throwError } from "rxjs";
import { ENVIRONMENT_CONFIG_TOKEN } from "../../injection-tokens/environment-configuration/env-configuration-token";
import { IpecaResponseBase } from "../participant/participant.service";
import { PDF_Request } from "core.shared/Typescript/DTO/V1/Document/pDF_Request"
import { DOC_Perimeter_T_Request } from "core.shared/Typescript/DTO/V1/Document/dOC_Perimeter_T_Request"
import { EpticaRequest  } from "core.shared/Typescript/DTO/V1/Eptica/epticaRequest"
import { DOC_Document_T   } from "core.shared/Typescript/DTO/V1/Document/dOC_Document_T"
import { HttpErrorMapper } from "../../utils/error-mapper/error-mapper.util";
import { DocCorrespondance } from "core.shared/Typescript/DTO/V1/Document/docCorrespondance";
import { DocCorrespondanceRequest } from "core.shared/Typescript/DTO/V1/Document/docCorrespondanceRequest";

 
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
export class EpticaService {
  
  private config = inject<EnvironmentConfig>(ENVIRONMENT_CONFIG_TOKEN);
  private http=inject(HttpBaseService)

    submitDocument(
    dto: EpticaRequest 
  ): Observable<IpecaResponseBase<SubmitDocResponseDto>> {
    return this.http
      .post<SubmitDocResponseDto>(
        this.config.ipecaApi.eptica.savedocuments,
        dto
      )
      .pipe(catchError(HttpErrorMapper.map));
  }
   fetchTypeDocumentAsync(
      request: DocCorrespondanceRequest
    ): Observable<DocCorrespondance[]> {
      return this.http
        .post<DocCorrespondance[]>(
          this.config.ipecaApi.eptica.getCorrespondance,
          request
        )
        .pipe(
          map(resp => resp.data),      
          catchError(HttpErrorMapper.map)
        );
    }
}
