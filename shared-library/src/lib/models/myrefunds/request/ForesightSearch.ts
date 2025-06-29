export class ForesightSearch {
  numeroParticipant: string;
  dateIndemnisationMin: string;
  dateIndemnisationMax: string;
  dateVersementMin: string;
  dateVersementMax: string;
  nombreDeLignes: string;
  isSiteWeb: boolean;
  platform: string;
  browser: string;
  engine: string;

  constructor(init?: Partial<ForesightSearch>) {
    this.numeroParticipant = init?.numeroParticipant ?? "";
    this.dateIndemnisationMin = init?.dateIndemnisationMin ?? "";
    this.dateIndemnisationMax = init?.dateIndemnisationMax ?? "";
    this.dateVersementMin = init?.dateVersementMin ?? "";
    this.dateVersementMax = init?.dateVersementMax ?? "";
    this.nombreDeLignes = init?.nombreDeLignes ?? "";
    this.isSiteWeb = init?.isSiteWeb ?? false;
    this.platform = init?.platform ?? "";
    this.browser = init?.browser ?? "";
    this.engine = init?.engine ?? "";
  }

  static empty(): ForesightSearch {
    return new ForesightSearch();
  }
}
