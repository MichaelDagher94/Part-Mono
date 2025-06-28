import { DestroyRef, inject, Injectable } from "@angular/core";

import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, Observable, of, tap } from "rxjs";
import { BeneficiaryService } from "../../../../../../../../../shared-library/src/lib/services/beneficiary/beneficiary.service";

interface DeleteBeneficiaryPayload {
  id: string;
  nom: string;
  prenom: string;
  nss: string;
  dateDeNaissance: string;
  sexe: string;
  email: string;
  phone: string;
  participantLinked: string;
  isSiteWeb: boolean;
  evenement: string;
  typeEvenement: string;
  files: string;
}

@Injectable({ providedIn: "root" })
export class BeneficiaryDeleteFacadeService {
  private beneficiaryService = inject(BeneficiaryService);
  private readonly destroyRef = inject(DestroyRef);

  private mapToApiPayload(
    formData: any,
    numeroParticipant: string,
    beneficiaryId: string
  ): DeleteBeneficiaryPayload {
    return {
      id: beneficiaryId,
      nom: formData.lastName || "",
      prenom: formData.firstName || "",
      nss: formData.socialSecurityNumber || formData.parent1Ssn || "",
      dateDeNaissance: formData.birthDate,
      sexe: formData.genre,
      email: "",
      phone: "",
      participantLinked: numeroParticipant,
      files: formData.attachments,
      evenement: formData.eventType,
      typeEvenement: formData.eventType,
      isSiteWeb: true,
    };
  }

  submitDeletion(
    formData: any,
    numParticipant: string,
    beneficiaryId: string
  ): Observable<boolean> {
    console.log("delete form", formData);
    const payload = this.mapToApiPayload(
      formData,
      numParticipant,
      beneficiaryId
    );
    console.log("payload facade", payload);

    return this.beneficiaryService.deleteBeneficiary(payload).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => console.log("Suppression réussie")),
      tap(() => true),
      catchError(error => {
        console.error("Erreur API:", error);
        return of(false);
      })
    );
  }
}
