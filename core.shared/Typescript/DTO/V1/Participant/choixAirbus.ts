/* Auto Generated */

import { EnuContrat } from "./../../../Enumerations/V1/enuContrat";
import { EnuContratAction } from "./../../../Enumerations/V1/enuContratAction";
import { EnuRaisonAdhesionParticipant } from "./../../../Enumerations/V1/enuRaisonAdhesionParticipant";
import { EnuContratResiliation } from "./../../../Enumerations/V1/enuContratResiliation";

export interface ChoixAirbus {
    id: number;
    numParticipant: string;
    contratParticipant: EnuContrat;
    contratAction: EnuContratAction;
    dateEffet?: Date;
    raisonAdhesion?: EnuRaisonAdhesionParticipant;
    libelle: string;
    description: string;
    dateResiliation?: Date;
    dateAdhesion?: Date;
    contratResiliation: EnuContratResiliation;
}
