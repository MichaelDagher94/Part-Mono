export class RefundSearchMultiCriteria {
  participantID: string;
  dateDeRemboursementMin: string;
  dateDeRemboursementMax: string;
  dateDeSoinMin: string;
  dateDeSoinMax: string;
  natureDeSoins: string;
  beneficiaire: string;
  nombreDeLigne: string;
  isSiteWeb: boolean;
  platform: string;
  browser: string;
  engine: string;

  constructor(init?: Partial<RefundSearchMultiCriteria>) {
    this.participantID = init?.participantID ?? "";
    this.dateDeRemboursementMin = init?.dateDeRemboursementMin ?? "";
    this.dateDeRemboursementMax = init?.dateDeRemboursementMax ?? "";
    this.dateDeSoinMin = init?.dateDeSoinMin ?? "";
    this.dateDeSoinMax = init?.dateDeSoinMax ?? "";
    this.natureDeSoins = init?.natureDeSoins ?? "";
    this.beneficiaire = init?.beneficiaire ?? "";
    this.nombreDeLigne = init?.nombreDeLigne ?? "";
    this.isSiteWeb = init?.isSiteWeb ?? false;
    this.platform = init?.platform ?? "";
    this.browser = init?.browser ?? "";
    this.engine = init?.engine ?? "";
  }

  static empty(): RefundSearchMultiCriteria {
    return new RefundSearchMultiCriteria();
  }
}
