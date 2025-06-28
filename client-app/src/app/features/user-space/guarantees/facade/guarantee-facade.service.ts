import { inject, Injectable } from "@angular/core";
import { GuaranteeService } from "../../../../../../../shared-library/src/lib/services/guarantee/guarantee.service";
import { ParticipantService } from "../../../../../../../shared-library/src/lib/services/participant/participant.service";
import { DocumentService } from "../../../../../../../shared-library/src/lib/services/document/document.service";
import { OfferService } from "../../../../../../../shared-library/src/lib/services/offre/offer.service";

@Injectable({
  providedIn: "root",
})
export class GuaranteeFacadeService {
  guaranteeService = inject(GuaranteeService);
  participantService = inject(ParticipantService);
  offerService = inject(OfferService);
  documentService = inject(DocumentService);

  getListPdfs(id: any) {
    const payload = {
      OffreId: id,
    };
    return this.documentService.getListePdfs(payload);
  }

  getCurrentParticipant() {
    return this.participantService.getCurrentParticipant();
  }

  getAllCustomDocs(data: any) {
    return this.offerService.getListeCustomOffers(data);
  }
  constructor() {}

  getAllNotices(participantId: string) {
    const payload = {
      ParticipantId: participantId,
    };
    return this.guaranteeService.getAllNotices(payload);
  }

  getNoticeFile(filename: string, participant: any) {
    const payload = {
      nomFichier: filename,
      reference: filename,
      envoieEmail: "0",
      numParticipant: participant.numeroParticipant,
      isSiteWeb: true,
      platform: "",
      browser: "",
      engine: "",
    };
    return this.guaranteeService.getNoticeFile(payload);
  }

  getFamilyContributionIntro() {
    return this.participantService.getContratAirbusChoice();
  }

  getAirbusContractChoice() {
    return this.guaranteeService.GetMyContributionAirbusAsync();
  }

  insertAirbusChoice(data: any) {
    return this.participantService.insertContratAirbusChoice(data);
  }
}
