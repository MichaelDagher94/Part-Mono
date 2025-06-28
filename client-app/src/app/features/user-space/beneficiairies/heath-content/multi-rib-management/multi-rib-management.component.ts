import { Component, inject, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { MultiRibFacadeService } from "./facade/multi-rib.facade.service";
import { MULTI_RIB_STATE } from "./state/multi-rib.state";

@Component({
  selector: "app-multi-rib-management",
  imports: [
    MatRadioModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    BeneficiaryCguComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./multi-rib-management.component.html",
  styleUrl: "./multi-rib-management.component.scss",
})
export class MultiRibManagementComponent implements OnInit {
  // Dependencies
  multiRibFacadeService = inject(MultiRibFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  private fb = inject(FormBuilder);
  toast = inject(ToastMessageService);
  modalService = inject(ModalService);
  private router = inject(Router);

  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant(),
    { initialValue: null }
  );

  consentResponseArray: any[] = [];
  text1 = MULTI_RIB_STATE.PART1_TEXT;
  text2 = MULTI_RIB_STATE.PART2_TEXT;
  isLoading = false;
  hasInitializedForm = false;
  radioButtonChoice = [
    { code: 1, label: "Oui" },
    { code: 0, label: "Non" },
  ];

  consentList = toSignal(
    this.participantFacade
      .getConsentList(this.currentParticipant()?.numeroParticipant)
      .pipe(
        map(consentList => {
          console.log("ConsentList", consentList);
          const grouped = consentList.reduce((grouped: any[], item: any) => {
            const existingGroup = grouped.find(
              group => group.type === item.type
            );
            if (existingGroup) {
              existingGroup.items.push(item);
            } else {
              grouped.push({ type: item.type, items: [item] });
            }
            return grouped;
          }, []);

          this.consentResponseArray = consentList.map((item: any) => ({
            NumParticipant: this.currentParticipant()?.numeroParticipant,
            IdConsentement: item.iD_Consentement,
            IdTypeReponse: null,
            response: false,
          }));

          if (!this.hasInitializedForm && consentList.length > 0) {
            setTimeout(() => {
              this.prefillFormWithExistingValues(consentList);
              this.hasInitializedForm = true;
            }, 100);
          }

          return grouped;
        })
      ),
    { initialValue: [] }
  );

  displayedColumns: string[] = [
    "nom",
    "prenom",
    "dateNaissance",
    "statut",
    "rib",
    "modification",
  ];

  consentForm = this.fb.group({
    participantConsent: [0, Validators.required],
    beneficiaryConsent: [0, Validators.required],
  });

  ngOnInit(): void {
    this.multiRibFacadeService.loadMajorBeneficiaries();
  }

  goToAddRib(id: any) {
    this.router
      .navigate(["mes-beneficiaires/ajouter-multi-rib", id])
      .then(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      });
  }

  onSubmit(): void {
    if (this.consentForm.valid && !this.isLoading) {
      const modalData = {
        title: "Gérer le multi RIB",
        message: `Êtes-vous sûr(e) de vouloir modifier vos consentements ?`,
        confirmText: "Oui",
        cancelText: "Non",
      };

      this.modalService
        .openConfirmationModal(modalData)
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.submitConsent();
          }
        });
    }
  }

  private prefillFormWithExistingValues(consentList: any[]): void {
    const multiRibConsents = consentList.filter(
      consent => consent.type === "Multi-Rib"
    );

    /* if (multiRibConsents.length !== 2) {
      return;
    } */

    let participantValue = 0;
    let beneficiaryValue = 0;

    multiRibConsents.forEach((consent, index) => {
      const isParticipantConsent = this.isParticipantConsentByPhrase(
        consent.phrase
      );
      const hasYesResponse = this.hasYesResponse(consent);

      if (isParticipantConsent && hasYesResponse) {
        participantValue = 1;
      } else if (!isParticipantConsent && hasYesResponse) {
        beneficiaryValue = 1;
      }
    });

    this.consentForm.patchValue({
      participantConsent: participantValue,
      beneficiaryConsent: beneficiaryValue,
    });
  }

  private hasYesResponse(consent: any): boolean {
    if (
      !consent.consentements_TypeReponse ||
      !Array.isArray(consent.consentements_TypeReponse)
    ) {
      return false;
    }

    const yesResponse = consent.consentements_TypeReponse.find(
      (tr: any) => tr.id === 3
    );

    const hasYes = yesResponse?.reponse === true;

    return hasYes;
  }

  private isParticipantConsentByPhrase(phrase: string): boolean {
    const phraseLower = phrase.toLowerCase();

    const participantIndicators = [
      "dans le cadre de mon compte personnel assuré",
      "mon ayant droit se verra donc verser",
      "mon ayant droit ait accès à mon compte personnel assuré",
    ];

    const beneficiaryIndicators = [
      "dans le cadre du compte personnel assuré de mon donnant droit",
      "le donnant droit (le participant) ait accès aux données",
      "remboursements liés à mes frais de santé",
    ];

    if (
      participantIndicators.some(indicator => phraseLower.includes(indicator))
    ) {
      return true;
    }

    if (
      beneficiaryIndicators.some(indicator => phraseLower.includes(indicator))
    ) {
      return false;
    }

    return true;
  }

  private getMultiRibConsents(groupedConsents: any[]): any[] {
    const multiRibConsents: any[] = [];

    groupedConsents.forEach(group => {
      if (group.type === "Multi-Rib") {
        multiRibConsents.push(...group.items);
      }
    });

    return multiRibConsents;
  }

  private submitConsent(): void {
    this.isLoading = true;

    const participant = this.currentParticipant();
    if (!participant) {
      this.toast.danger("Erreur", "Informations participant non disponibles");
      this.isLoading = false;
      return;
    }

    const formValues = this.consentForm.value;
    const participantConsent = formValues.participantConsent === 1;
    const beneficiaryConsent = formValues.beneficiaryConsent === 1;

    const allConsents = this.consentList();
    const multiRibConsents = this.getMultiRibConsents(allConsents);

    if (multiRibConsents.length !== 2) {
      this.toast.danger(
        "Erreur",
        `Nombre de consentements Multi-RIB incorrect: ${multiRibConsents.length}`
      );
      this.isLoading = false;
      return;
    }

    const consentUpdates: any[] = [];

    multiRibConsents.forEach((consent: any, index: number) => {
      const isParticipantConsent = this.isParticipantConsentByPhrase(
        consent.phrase
      );
      const selectedResponse = isParticipantConsent
        ? participantConsent
        : beneficiaryConsent;

      consentUpdates.push({
        NumParticipant: participant.numeroParticipant,
        IdConsentement: consent.iD_Consentement,
        IdTypeReponse: 3,
        response: selectedResponse === true,
      });

      consentUpdates.push({
        NumParticipant: participant.numeroParticipant,
        IdConsentement: consent.iD_Consentement,
        IdTypeReponse: 4,
        response: selectedResponse === false,
      });
    });

    this.participantFacade.updateConsentParticipant(consentUpdates).subscribe({
      next: response => {
        if (response) {
          this.toast.success(
            "Gérer le multi RIB",
            "Vos préférences ont bien été enregistrées."
          );

          this.reloadConsentData();
        } else {
          this.toast.danger(
            "Erreur",
            "Une erreur est survenue lors de l'enregistrement de votre demande. Nous vous invitons à la renouveler ultérieurement"
          );
        }
      },
      error: error => {
        console.error("API Error:", error);
        this.toast.danger(
          "Erreur",
          "Une erreur est survenue lors de l'enregistrement de votre demande. Nous vous invitons à la renouveler ultérieurement"
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private reloadConsentData(): void {
    this.hasInitializedForm = false;

    setTimeout(() => {
      this.participantFacade
        .getConsentList(this.currentParticipant()?.numeroParticipant)
        .subscribe(consentList => {
          console.log("Données rechargées:", consentList);
          this.prefillFormWithExistingValues(consentList);
          this.hasInitializedForm = true;
        });
    }, 1000);
  }

  get canSubmit(): boolean {
    return (
      this.consentForm.valid &&
      !this.isLoading &&
      this.currentParticipant() !== null
    );
  }

  get submitButtonText(): string {
    if (this.isLoading) {
      return "Enregistrement en cours...";
    }
    return "Enregistrer";
  }
}
