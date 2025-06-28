/* Auto Generated */

import { EnuActivationType } from "./../../../Enumerations/V1/enuActivationType";

export interface ActivationCompteRequest {
    nom: string;
    prenom: string;
    dateDeNaissance: string;
    codePostal: string;
    champIdentification: string;
    email: string;
    lienPageActivation: string;
    activationCode: string;
    activationType: EnuActivationType;
    isSiteWeb: boolean;
    platform: string;
    engine: string;
    browser: string;
}
