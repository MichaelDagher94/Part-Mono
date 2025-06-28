/* Auto Generated */

import { EnuGenre } from "./../../../Enumerations/V1/enuGenre";
import { ParticipantAdresse } from "./participantAdresse";
import { EpticaRequest } from "./../Eptica/epticaRequest";

export interface CoordonneeParticipantRequest {
    numParticipant: string;
    genre: EnuGenre;
    telephone1: string;
    telephone2: string;
    adresse: ParticipantAdresse;
    saveDocument: EpticaRequest;
    isSiteWeb: boolean;
    platform: string;
    browser: string;
    engine: string;
}
