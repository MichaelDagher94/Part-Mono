import { Injectable } from "@angular/core";
import { UploadRequest   } from "core.shared/Typescript/DTO/v1/Document/uploadRequest"
import { Observable, of, from, mergeMap, throwError, map, toArray } from "rxjs";
import { fileToBase64 } from "./file.util";

export interface UploadProgressDto {
  fileName: string;
  loaded: number;
  total: number;
  percent: number;
}

@Injectable({ providedIn: 'root' })
export class FileUploadHelper {
  private static readonly DEFAULT_SIZE_LIMIT = 10 * 1024 * 1024;

  uploadFiles(
    section: string,
    files: File[],
    sizeLimitBytes = FileUploadHelper.DEFAULT_SIZE_LIMIT,
  ): Observable<UploadRequest[]> {
    if (!files?.length) {
      return of([]);
    }

    return from(files).pipe(
      mergeMap(file => {
        if (file.size > sizeLimitBytes) {
          return throwError(
            () =>
              new Error(
                `"${file.name}" exceeds size limit of ${sizeLimitBytes} bytes`,
              ),
          );
        }

        return fileToBase64(file).pipe(
          map<string, UploadRequest>(base64 => {
            const dataBytes = Array.from(atob(base64), ch => ch.charCodeAt(0));

            return {
              id: this.generateId(),
              lot: section,           
              data: dataBytes,
              dataSendToGedXML: dataBytes,
              isWebSite: true,
            };
          }),
        );
      }),
      toArray(),
    );
  }

  static toProgressDto(evt: ProgressEvent<FileReader>): UploadProgressDto {
    const { loaded, total } = evt;
    return {
      fileName: (evt.target?.result as any)?.name ?? '',
      loaded,
      total,
      percent: total ? Math.round((loaded / total) * 100) : 0,
    };
  }

  private generateId(): string {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 10);
  }
}