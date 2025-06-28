/* Auto Generated */

import { EnuChoix } from "./../../../Enumerations/V1/enuChoix";

export interface ChoixAirbusRequest {
    numeroParticipant: string;
    choix: EnuChoix;
    raisonAdhesion: number;
    moisAdhesion: string;
    dateResiliation: Date;
    isSiteWeb: boolean;
    platform: string;
    browser: string;
    engine: string;
}
