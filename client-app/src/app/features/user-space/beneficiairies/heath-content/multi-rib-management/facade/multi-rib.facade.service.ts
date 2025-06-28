import { inject, Injectable, signal } from "@angular/core";
import { BeneficiaryService } from "../../../../../../../../../shared-library/src/lib/services/beneficiary/beneficiary.service";
import { BeneficiaryRequest } from "../../../../../../../../../shared-library/src/lib/models/beneficiary/request/BeneficiaryRequest";
import { catchError, map, of, tap } from "rxjs";
import { BeneficiaryBankRequest } from "../../multi-rib-add/state/interface/IpecaBeneficiaryBankRequest";
import { ParticipantService } from "../../../../../../../../../shared-library/src/lib/services/participant/participant.service";

@Injectable({ providedIn: "root" })
export class MultiRibFacadeService {
  private beneficiaryService = inject(BeneficiaryService);
  private participantService = inject(ParticipantService);
  connectedUser = signal<any>("");
  beneficiaries = signal<any[]>([]);

  private getConnectedUser(): any {
    try {
      const user = localStorage.getItem("currentUser");
      if (!user) return null;

      return JSON.parse(user);
    } catch (error) {
      return null;
    }
  }

  loadMajorBeneficiaries(): void {
    this.connectedUser.set(this.getConnectedUser());
    const beneficiaryRequest = new BeneficiaryRequest();
    beneficiaryRequest.numParticipant = this.connectedUser().numeroParticipant;

    this.beneficiaryService
      .getAllBeneficiaries(beneficiaryRequest)
      .pipe(
        map(beneficiaries =>
          this.filterMajorBeneficiaries(beneficiaries ?? [])
        ),
        tap(filteredBeneficiaries => {
          console.log(filteredBeneficiaries);
          this.beneficiaries.set(filteredBeneficiaries);
        }),
        catchError(error => {
          console.warn(error);
          return of([]);
        })
      )
      .subscribe();
  }

  private filterMajorBeneficiaries(beneficiaries: any[]): any[] {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    return beneficiaries.filter(beneficiary => {
      if (!beneficiary.dateNaissance) return false;

      const birthDate = new Date(beneficiary.dateNaissance);

      const age = currentYear - birthDate.getFullYear();
      const monthDiff = currentMonth - birthDate.getMonth();

      // verification by month and Date
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && currentDay < birthDate.getDate())
      ) {
        return age - 1 >= 18;
      }
      return age >= 18;
    });
  }

  updateIbanBeneficiary(data: BeneficiaryBankRequest) {
    console.log("iban update, facade data", data);
    return this.participantService.updateIban(data).subscribe();
  }
}
