import { inject, Injectable } from "@angular/core";
import { BeneficiaryService } from "../../../../../../../../shared-library/src/lib/services/beneficiary/beneficiary.service";
import { BeneficiaryRequest } from "../../../../../../../../shared-library/src/lib/models/beneficiary/request/BeneficiaryRequest";
import { catchError, of } from "rxjs";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";

@Injectable({
  providedIn: "root",
})
export class BeneficiaryFacadeService {
  beneficiaryService = inject(BeneficiaryService);
  private readonly toast = inject(ToastMessageService);
  constructor() {}

  getAllBeneficiaries(numParticipant: string) {
    const beneficiaryRequest = new BeneficiaryRequest();
    beneficiaryRequest.numParticipant = numParticipant;

    return this.beneficiaryService.getAllBeneficiaries(beneficiaryRequest).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }
}
