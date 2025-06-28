/* Auto Generated */

import { AssurePrincipal } from "./assurePrincipal";
import { Beneficiaires } from "./beneficiaires";

export interface ParticipantWalletminiscule {
    contratResponsable: string;
    type: string;
    numeroAMC: string;
    qrCode: string;
    assurePrincipal: AssurePrincipal;
    beneficiaires: Beneficiaires[];
    debutValidite: string;
    finValidite: string;
    carte_active: string;
    codeGR: string;
    assistanceReference: string;
    assistanceContact: string;
    complementGR: string;
    statut: string;
}
