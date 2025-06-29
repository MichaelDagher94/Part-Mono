export class BeneficiaryRequest {
  numParticipant: string = "";
  numAttestation: string = "";
  id: string = "";
  banqueInfo: {
    domiciliation: string;
    titulaire: string;
    iban: string;
    bicSwift: string;
  } = {
    domiciliation: "",
    titulaire: "",
    iban: "",
    bicSwift: "",
  };
  email: string = "";
  phone: string = "";
  adresse: {
    adresse1: string;
    adresse2: string;
    adresse3: string;
    codePostal: string;
    ville: string;
    pays: string;
    isSiteWeb: boolean;
    platform: string;
    browser: string;
    engine: string;
  } = {
    adresse1: "",
    adresse2: "",
    adresse3: "",
    codePostal: "",
    ville: "",
    pays: "",
    isSiteWeb: false,
    platform: "",
    browser: "",
    engine: "",
  };
  password: string = "";
  oldPassword: string = "";
  iban: string = "";
  origine: string = "";
  domiciliation: string = "";
  titulaire: string = "";
  bic: string = "";
  envoiemail: string = "";
  decompteCode: string = "";
  dateEmission: string = "";
  montant: number = 0;
  service: string = "";
  isSiteWeb: boolean = false;
  platform: string = "";
  browser: string = "";
  engine: string = "";
  isAirbus: boolean = false;
  activationCode: string = "";

  constructor() {}
}
