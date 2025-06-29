export class AddBeneficiaryRequest {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  nss: string;
  dateDeNaissance: string;
  dateDeSurvenance: string;
  rang: string;
  numeroRAT: string;
  sexe: string;
  mjf: string;
  situation: string;
  participantLinked: string;
  evenement: string;
  typeDemande: string;
  vip: string;
  files: string[];
  typeEvenement: string;
  isSiteWeb: boolean;
  platform: string;
  browser: string;
  engine: string;

  constructor(data?: Partial<AddBeneficiaryRequest>) {
    this.id = data?.id || "";
    this.nom = data?.nom || "";
    this.prenom = data?.prenom || "";
    this.email = data?.email || "";
    this.phone = data?.phone || "";
    this.nss = data?.nss || "";
    this.dateDeNaissance = data?.dateDeNaissance || "";
    this.dateDeSurvenance = data?.dateDeSurvenance || "";
    this.rang = data?.rang || "";
    this.numeroRAT = data?.numeroRAT || "";
    this.sexe = data?.sexe || "";
    this.mjf = data?.mjf || "";
    this.situation = data?.situation || "";
    this.participantLinked = data?.participantLinked || "";
    this.evenement = data?.evenement || "";
    this.typeDemande = data?.typeDemande || "";
    this.vip = data?.vip || "";
    this.files = data?.files || [];
    this.typeEvenement = data?.typeEvenement || "";
    this.isSiteWeb = data?.isSiteWeb ?? false;
    this.platform = data?.platform || "";
    this.browser = data?.browser || "";
    this.engine = data?.engine || "";
  }
}
