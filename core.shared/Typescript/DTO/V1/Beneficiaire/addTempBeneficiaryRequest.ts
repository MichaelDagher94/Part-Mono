/* Auto Generated */

import { EnuGenre } from "./../../../Enumerations/V1/enuGenre";

export interface AddTempBeneficiaryRequest {
    numParticipant: string;
    lastName: string;
    firstName: string;
    genre: EnuGenre;
    numSS: string;
    clefSS: string;
    numSS2: string;
    clefSS2: string;
    bornDate: Date;
    rang?: number;
    reason: string;
    alsoCovered: boolean;
    eTransmission: boolean;
}
