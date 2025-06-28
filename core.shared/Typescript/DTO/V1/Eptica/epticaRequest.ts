/* Auto Generated */

import { EnuEpticaDestination } from "./../../../Enumerations/V1/enuEpticaDestination";

export interface EpticaRequest {
    destination: EnuEpticaDestination;
    comment: string;
    files: number[];
    application: string;
    numPlitg: string;
    numDocg: string;
    formName: string;
    subject: string;
    socialSecurityNumber: string;
    numParticipant: string;
    lastName: string;
    firstName: string;
    birthdate: string;
    vip: string;
    email: string;
    htmlBody: string;
    isSiteWeb: boolean;
    platform: string;
    browser: string;
    engine: string;
}
