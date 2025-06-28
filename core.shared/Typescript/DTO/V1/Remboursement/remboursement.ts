/* Auto Generated */

import { RemboursementSanteDetails } from "./remboursementSanteDetails";

export interface Remboursement {
    numeroParticipant: string;
    dateRemboursementComplete: Date;
    dateSoinComplete?: Date;
    dateDeRemboursement: string;
    truncatDateDeRemboursement: string;
    libelle: string;
    montantVerseIpeca: string;
    depense: number;
    ordre: string;
    codesActes: string;
    beneficiairePrenom: string;
    beneficiaireNom: string;
    beneficiaireCivilite: string;
    beneficiaireDateNaissance: string;
    autreOrganisme: number;
    securiteSociale: number;
    rac: number;
    numeroBordereau: string;
    codeBordereau: string;
    remboursementsSanteDetail: RemboursementSanteDetails[];
}
