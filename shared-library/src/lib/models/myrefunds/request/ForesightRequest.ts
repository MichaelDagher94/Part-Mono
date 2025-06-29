export class ForesightRequest {
  numParticipant: string = "";
  dateDeRemboursement1: string = "";
  dateDeRemboursement2: string = "";
  nombreDeLignes: string = "";
  montant: number = 0;
  datePrevoyance: string = "";
  natureDeSoins: string = "";
  beneficiaire: string = "";
  decompteParticipant: string = "";
  dateEmission: string = "";
  decompteCode: string = "";
  envoiemail: string = "";
  emailSender: string = "";
  isSiteWeb: boolean = false;
  platform: string = "";
  browser: string = "";
  engine: string = "";
  numeroBordereau: string = "";
  codeBordereau: string = "";

  constructor(init?: Partial<ForesightRequest>) {
    Object.assign(this, init);
  }
}
