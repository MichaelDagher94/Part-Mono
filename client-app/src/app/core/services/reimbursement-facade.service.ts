import { inject, Injectable } from "@angular/core";
import { MyRefundService } from "../../../../../shared-library/src/lib/services/my-refund/my-refund.service";

@Injectable({
  providedIn: "root",
})
export class ReimbursementFacadeService {
  private readonly reimbService = inject(MyRefundService);
  constructor() {}

  fetchReimbursementHealtList(ParticipantNumber: string) {
    const payload = {
      numParticipant: ParticipantNumber,
      dateDeRemboursement1: "",
      dateDeRemboursement2: "",
      nombreDeLignes: "",
      montant: 0,
      datePrevoyance: "",
      natureDeSoins: "",
      beneficiaire: "",
      decompteParticipant: "",
      dateEmission: "",
      decompteCode: "",
      envoiemail: "",
      emailSender: "",
      isSiteWeb: false,
      platform: "",
      browser: "",
      engine: "",
      numeroBordereau: "",
      codeBordereau: "",
    };
    return this.reimbService.healthRefund(payload);
  }
  fetchReimbursementForesightList(ParticipantNumber: string) {
    const payload = {
      numParticipant: ParticipantNumber,
      dateDeRemboursement1: "",
      dateDeRemboursement2: "",
      nombreDeLignes: "",
      montant: 0,
      datePrevoyance: "",
      natureDeSoins: "",
      beneficiaire: "",
      decompteParticipant: "",
      dateEmission: "",
      decompteCode: "",
      envoiemail: "",
      emailSender: "",
      isSiteWeb: false,
      platform: "",
      browser: "",
      engine: "",
      numeroBordereau: "",
      codeBordereau: "",
    };
    return this.reimbService.foresightRefund(payload);
  }

  downloadRefundHealth(row: any, userEmail: string) {
    const payload = {
      participantNumber: row.numeroParticipant,
      amount: row.montantVerseIpeca,
      refundDate: new Date(row.dateRemboursementComplete),
      ENVOIEMAIL: "0",
      participantEmail: userEmail,
      codeBordereau: row.codeBordereau,
      numeroBordereau: row.numeroBordereau,
      natureSoin: row.remboursementsSanteDetail[0].libelle || "",
      beneficiaire: String(row.remboursementsSanteDetail[0].beneficiaire),
      nbrLignes: String(row.remboursementsSanteDetail.length) || "0",
    };

    return this.reimbService.GetExpenseFileAsync(payload);
  }
}
