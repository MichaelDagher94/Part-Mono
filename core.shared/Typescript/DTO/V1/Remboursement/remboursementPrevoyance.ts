/* Auto Generated */

import { LeBeneficiaire } from "./../Beneficiaire/leBeneficiaire";
import { CodesActes } from "./codesActes";
import { RemboursementPrevoyanceDetails } from "./remboursementPrevoyanceDetails";

export interface RemboursementPrevoyance {
    dateDeRemboursementComplet: Date;
    numeroParticipant: string;
    identifiant_Decompte: string;
    truncatDateDeRemboursement: string;
    dateReglement: string;
    dateDeRemboursement: string;
    libelle: string;
    montant: string;
    dateIndeminisationMin: Date;
    dateIndeminisationMax: Date;
    beneficiaires: LeBeneficiaire[];
    codactes: CodesActes[];
    typeRemboursement: string;
    libelleTypeRemboursement: string;
    periodeDateRemboursement: string;
    numeroDeDossier: string;
    tauxActivite: string;
    montantBrut: string;
    csgNonImposable: string;
    csgImposable: string;
    rdsImposable: string;
    casaImposable: string;
    montantNetFiscal: string;
    pasTypeTaux: string;
    pasTaux: string;
    pasMontant: string;
    civilite: string;
    pdf: boolean;
    remboursementsPrevoyanceDetail: RemboursementPrevoyanceDetails[];
}
