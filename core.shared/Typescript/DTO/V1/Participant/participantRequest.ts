/* Auto Generated */

import { ParticipantBanque } from "./participantBanque";
import { ParticipantAdresse } from "./participantAdresse";

export interface ParticipantRequest {
    numParticipant: string;
    numAttestation: string;
    id: string;
    banqueInfo: ParticipantBanque;
    email: string;
    phone: string;
    adresse: ParticipantAdresse;
    password: string;
    oldPassword: string;
    iban: string;
    origine: string;
    domiciliation: string;
    titulaire: string;
    bic: string;
    envoiemail: string;
    decompteCode: string;
    dateEmission: string;
    montant: number;
    service: string;
    isSiteWeb: boolean;
    platform: string;
    browser: string;
    engine: string;
    isAirbus: boolean;
    activationCode: string;
}
