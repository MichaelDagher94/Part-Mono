/* Auto Generated */

import { LeBeneficiaire } from "./../Beneficiaire/leBeneficiaire";
import { CodesActes } from "./codesActes";

export interface RemboursementPrevoyanceDetails {
    numeroParticipant: string;
    montant: string;
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
    beneficiaires: LeBeneficiaire[];
    codactes: CodesActes[];
}
