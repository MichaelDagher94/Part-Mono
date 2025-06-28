/* Auto Generated */

import { EnuGenre } from "./../../../Enumerations/V1/enuGenre";
import { ParticipantAdresse } from "./participantAdresse";

export interface Participant {
    id: string;
    numeroParticipant: string;
    numeroIdentifiant: string;
    nom: string;
    nomJeuneFille: string;
    prenom: string;
    situationFamiliale: string;
    dateNaissance: Date;
    numeroSecuriteSociale: string;
    clefSecuriteSociale: string;
    email: string;
    genre: EnuGenre;
    adresse: ParticipantAdresse;
    iban: string;
    telephone: string;
    vip: string;
    domiciliation: string;
    bic: string;
    titulaire: string;
    nombreTentative?: number;
    statusTeleTransmission: boolean;
    pays: string;
    telephonePortable: string;
    multiRib: string;
    ribBeneficiaire: string;
    codeAdherent: string;
    codeEtablissement: string;
    ageActuel: number;
    ageEnFinAnnee: number;
    population: string;
    couvertureSante: boolean;
    couvertureDeces: boolean;
    couvertureArretTravail: boolean;
    civilite: string;
    premiereMutuelle: string;
    gestionCompte: boolean;
    numAttestation: string;
    debutCarteTp: string;
    finCarteTp: string;
    numAttestationFuture: string;
    debutCarteTpFuture: string;
    finCarteTpFuture: string;
    premiereConnexion: boolean;
    echeancierIndiv: boolean;
    isAirbus: boolean;
    dateEntreEntreprise?: Date;
}
