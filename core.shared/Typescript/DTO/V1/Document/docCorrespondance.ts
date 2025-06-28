/* Auto Generated */

import { PieceJustificative } from "./pieceJustificative";

export interface DocCorrespondance {
    id: number;
    typeDocument: string;
    email: string;
    emailAgence: string;
    objet: string;
    destination: string;
    objet_Obligatoire: string;
    canal_Destination: boolean;
    myIpeca_Transmettre: boolean;
    sante_Demande_Devis: boolean;
    sante_Demande_PEC_Hospi: boolean;
    sante_Justificatif: boolean;
    sante_Remboursement: boolean;
    sante_Demande_Information: boolean;
    prevoyance_Demande_Information: boolean;
    prevoyance_Justificatif: boolean;
    beneficiaire_Modification: boolean;
    beneficiaire_Ajout: boolean;
    beneficiaire_Suppression: boolean;
    teletransmission: boolean;
    formulaireANI: boolean;
    formulaireProblemeConnexion: boolean;
    formulairePS: boolean;
    formulaireReclamation: boolean;
    formulaireDemandeInfo: boolean;
    pieces: PieceJustificative[];
}
