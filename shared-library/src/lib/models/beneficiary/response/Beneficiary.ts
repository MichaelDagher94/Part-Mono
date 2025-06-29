export class Beneficiary {
  bics: string = "";
  clefSecuriteSociale: string = "";
  dateAffiliation: string = "";
  dateDeNaissance: string = "";
  dateNaissance: Date | null = null;
  debutCarteTp: string = "";
  debutCarteTpFuture: string = "";
  domiciliationIban: string = "";
  finCarteTp: string = "";
  finCarteTpFuture: string = "";
  genre: number | null = null;
  iban: string = "";
  id: string = "";
  nom: string = "";
  nomComplet: string = "";
  nomJeuneFille: string = "";
  numAttestation: string = "";
  numAttestationFuture: string = "";
  numeroSecuriteSociale: string = "";
  numeroSecuriteSociale2: string = "";
  premiereMutuelle: string = "";
  prenom: string = "";
  rang: { id: string; label: string } | null = null;
  statutRib: boolean = false;
  statutTeletransmission: boolean = false;
  titulaireIban: string = "";

  constructor() {}
}
