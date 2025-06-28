/* Auto Generated */

import { EnuDocType } from "./../../../Enumerations/V1/enuDocType";
import { EnuDocFormat } from "./../../../Enumerations/V1/enuDocFormat";

export interface DOC_Document_T {
    id: string;
    libelle: string;
    type?: EnuDocType;
    format?: EnuDocFormat;
    fileName: string;
    fileExtension: string;
    filePath: string;
}
