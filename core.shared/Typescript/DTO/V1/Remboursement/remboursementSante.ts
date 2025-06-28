/* Auto Generated */

import { RemboursementSanteDetails } from "./remboursementSanteDetails";

export interface RemboursementSante {
    numeroParticipant: string;
    dateRemboursementComplete: Date;
    dateSoinComplete?: Date;
    dateDeRemboursement: string;
    truncatDateDeRemboursement: string;
    libelle: string;
    montantVerseIpeca: string;
    depense: string;
    ordre: string;
    codesActes: string;
    beneficiairePrenom: string;
    beneficiaireDateNaissance: string;
    autreOrganisme: string;
    securiteSociale: string;
    rac: string;
    archivePdf: string;
    numeroBordereau: string;
    libellePaiement: string;
    referenceReleve: string;
    codeBordereau: string;
    numeroLot: number;
    participant: number;
    familleActe: string;
    beneficiaireNom: string;
    beneficiaireId: number;
    remboursementsSanteDetail: RemboursementSanteDetails[];
}
