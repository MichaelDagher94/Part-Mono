/* Auto Generated */

import { EnuGenre } from "./../../../Enumerations/V1/enuGenre";
import { RangBeneficiaire } from "./rangBeneficiaire";

export interface LeBeneficiaire {
    id: string;
    nom: string;
    nomJeuneFille: string;
    prenom: string;
    nomComplet: string;
    dateNaissance: Date;
    dateDeNaissance: string;
    numeroSecuriteSociale: string;
    clefSecuriteSociale: string;
    genre: EnuGenre;
    rang: RangBeneficiaire;
    dateAffiliation: string;
    numAttestation: string;
    debutCarteTp: string;
    finCarteTp: string;
    numAttestationFuture: string;
    debutCarteTpFuture: string;
    finCarteTpFuture: string;
    statutTeletransmission: boolean;
    premiereMutuelle: string;
    domiciliationIban: string;
    titulaireIban: string;
    bics: string;
    iban: string;
    statutRib: boolean;
}
