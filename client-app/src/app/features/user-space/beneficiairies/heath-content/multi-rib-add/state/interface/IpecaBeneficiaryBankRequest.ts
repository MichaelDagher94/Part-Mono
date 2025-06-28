export interface IIpecaBeneficiaryBankRequest {
  numParticipant?: string;
  iban?: string;
  origine?: string;
  domiciliation?: string;
  titulaire?: string;
  bic?: string;
  banqueInfo?: BanqueInfo;
}

export interface BanqueInfo {
  domicialiation?: string;
  titulaire?: string;
  iban?: string;
  bicSwift?: string;
}

export interface Adresse {
  adresse1?: string;
  adresse2?: string;
  adresse3?: string;
  codePostal?: string;
  ville?: string;
  pays?: string;
}

export interface BeneficiaryBankRequest {
  numParticipant?: string;
  numAttestation?: string;
  id?: string;
  banqueInfo?: BanqueInfo;
  email?: string;
  phone?: string;
  adresse?: Adresse;
  password?: string;
  oldPassword?: string;
  iban?: string;
  origine?: string;
  domiciliation?: string;
  titulaire?: string;
  bic?: string;
  envoiemail?: string;
  decompteCode?: string;
  dateEmission?: string;
  montant?: number;
  service?: string;
  isSiteWeb?: boolean;
  platform?: string;
  browser?: string;
  engine?: string;
  isAirbus?: boolean;
  activationCode?: string;
}
