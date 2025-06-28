import { inject, Injectable, signal } from "@angular/core";
import { BeneficiaryService } from "../../../../../../shared-library/src/lib/services/beneficiary/beneficiary.service";
import { BeneficiaryRequest } from "../../../../../../shared-library/src/lib/models/beneficiary/request/BeneficiaryRequest";
import { ParticipantFacadeService } from "../participant-facade/participant-facade.service";
import { catchError, of } from "rxjs";
import { ToastMessageService } from "../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";

@Injectable({
  providedIn: "root",
})
export class BeneficiaryFacadeService {
  beneficiaryService = inject(BeneficiaryService);
  participantService = inject(ParticipantFacadeService);
  private toast = inject(ToastMessageService);
  participant = signal<any>(null);

  constructor() {}

  getParticipant() {
    this.participantService.getCurrentParticipant().subscribe(participant => {
      this.participant.set(participant);
    });
  }

  getAllBeneficiary() {
    const beneficiaryRequest = new BeneficiaryRequest();
    this.getParticipant();
    beneficiaryRequest.numParticipant = this.participant().numeroParticipant;
    return this.beneficiaryService.getAllBeneficiaries(beneficiaryRequest).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }

  findOneBeneficiary(benefRequest: BeneficiaryRequest, id: string) {
    return this.beneficiaryService.getBeneficiaryById(benefRequest, id);
  }
}
