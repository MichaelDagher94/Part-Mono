import { Component, effect, inject, signal } from "@angular/core";

import { CommonModule } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject } from "rxjs";
import { Contrat } from "../../../../../../../../shared-library/src/lib/enumerations/v1/Contrat.enum";
import { ListState } from "../../../../../../../../shared-library/src/lib/models/state/list-state.model";
import { SkeletonTableLoaderComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/loader/skeleton-table-loader/skeleton-table-loader.component";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { BeneficaryAddFormComponent } from "../../../../../components/benificiary/beneficary-add-form/beneficary-add-form.component";
import { BeneficiaryFacadeService } from "../../facades/beneficiary-facade.service";

@Component({
  selector: "app-add-beneficiary",
  standalone: true,
  imports: [
    BeneficaryAddFormComponent,
    CommonModule,
    SkeletonTableLoaderComponent,
  ],
  templateUrl: "./add-beneficiary.component.html",
  styleUrl: "./add-beneficiary.component.scss",
})
export class AddBeneficiaryComponent {
  currentUser!: any;

  loadingState$ = new BehaviorSubject<ListState<any>>({
    loading: false,
    error: null,
    data: [],
  });

  private beneficiaryFacade = inject(BeneficiaryFacadeService);
  private toast = inject(ToastMessageService);

  private contribution = toSignal(this.beneficiaryFacade.getContribution(), {
    initialValue: null,
  });

  private currentParticipant = toSignal(
    this.beneficiaryFacade.getCurrentParticipant(),
    { initialValue: null }
  );
  private typeDocumentModels = toSignal(
    this.beneficiaryFacade.getTypeDocumentsModels(),
    { initialValue: null }
  );

  private currentReason = signal(null);
  private currentFormValue = signal<any>("");

  sectionName = "AddBeneficiaryForm";
  successMessage = "";
  continueGeD = "";
  message = "";
  isMinor = false;
  minorAge = 18;

  isFamilyContribution = true;

  constructor() {
    this.loadingState$.next({ loading: true, error: null, data: [] });
    effect(() => {
      console.log("effect triggered", this.contribution());
      const isAirbus = this.currentParticipant().isAirbus;
      var isFamille = false;
      if (this.contribution()) {
        isFamille = this.contribution().contratParticipant === Contrat.Famille;
      }

      this.isFamilyContribution = !isAirbus || isFamille;
      this.loadingState$.next({ loading: false, error: null, data: [] });
    });
  }

  /**
   * form after validation
   * @param formValue
   */
  handleFormValidation(formValue: any): void {
    this.prepareDataToSave(formValue);
  }

  prepareDataToSave(formValue: any) {
    this.currentReason.set(formValue.reason.value);
    this.currentFormValue.set(formValue);
    const reason = formValue.reason.text.toUpperCase() ?? "";
    this.setSuccessMessage(reason);
    if (reason != "ASCENDANT") {
      const requestPayload = this.createTempBenefRequest(formValue, reason);
      this.saveTempBeneficiary(requestPayload);
    } else this.continuePayloadPrepare();
  }

  private checkAge(birthDate: Date | string, ageRequired: number): boolean {
    const birth = new Date(birthDate);
    const majority = new Date(
      birth.getFullYear() + ageRequired,
      birth.getMonth(),
      birth.getDate()
    );
    return new Date() >= majority;
  }

  createTempBenefRequest(formValue: any, reason: string) {
    this.isMinor = !this.checkAge(formValue.birthDate, this.minorAge);
    return {
      NumParticipant: this.currentParticipant().numeroParticipant,
      LastName: formValue.lastName,
      FirstName: formValue.firstName,
      Genre: formValue.gender,
      NumSS: this.isMinor
        ? formValue.parent1Ssn.length >= 13
          ? formValue.parent1Ssn.substring(0, 13)
          : null
        : formValue.socialSecurityNumber >= 13
        ? formValue.socialSecurityNumber.substring(0, 13)
        : null,
      ClefSS: this.isMinor
        ? formValue.parent1Ssn.length >= 15
          ? formValue.parent1Ssn.substring(13, 2)
          : null
        : formValue.socialSecurityNumber >= 15
        ? formValue.socialSecurityNumber.substring(13, 2)
        : null,
      NumSS2:
        this.isMinor && formValue.parent1Ssn.length >= 13
          ? formValue.parent1Ssn.substring(0, 13)
          : null,

      ClefSS2:
        this.isMinor && formValue.parent1Ssn.length >= 15
          ? formValue.parent1Ssn.substring(13, 2)
          : null,
      BornDate: formValue.birthDate,
      Rang: formValue.birthRank,
      Reason: reason,
      AlsoCovered: formValue.isCoveredByOtherMutual,
      ETransmission: formValue.teletransmission,
    };
  }

  private setSuccessMessage(reason: string) {
    if (
      reason == "NAISSANCE" ||
      reason == "ADOPTION" ||
      reason == "ENFANT" ||
      reason == "ENFANT HANDICAPE"
    ) {
      this.successMessage =
        "Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion. Attention: si votre conjoint(e) a son propre contrat santé chez IPECA, nous l’invitons à partir de son espace privé, à effectuer la même démarche pour ajouter le bénéficiaire concerné.";
    } else {
      this.successMessage =
        "Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion.";
    }
  }

  /**
   * call the save service
   *
   * @param benefReq beneficary request data.
   */
  private saveTempBeneficiary(benefReq: any): void {
    this.beneficiaryFacade.saveTempBeneficiary(benefReq).subscribe({
      next: res => {
        if (res) {
          this.continueGeD = res.pDsReponse.OK_KO;
          if (this.continueGeD != "KO") {
            this.continuePayloadPrepare();
          }
        } else {
          console.warn("⚠️ Aucun résultat retourné par l'API.");
        }
      },
      error: error => {
        console.error("❌ Erreur lors de l'enregistrement :", error);
      },
    });
  }

  private continuePayloadPrepare() {
    const typeDocument = this.typeDocumentModels().find(
      (x: any) => x.objet == this.currentReason()
    );

    const customHtmlBody = this.createHtmlBody(typeDocument);
    const files = this.beneficiaryFacade.getFiles(this.sectionName);
    const payload = this.createPayloadToEmail(
      typeDocument,
      customHtmlBody,
      files
    );
    this.beneficiaryFacade.submitDocumentStep(payload).subscribe({
      next: next => {
        this.beneficiaryFacade.clearFiles(this.sectionName);
        this.toast.success("Succès", this.successMessage, 5000, () =>
          location.reload()
        );
      },
      error: err => {
        this.toast.danger(
          "Oups",
          err.message ??
            "Erreur lors de l'enregistrement. Veuillez réessayer plus tard "
        );
      },
    });
  }

  createPayloadToEmail(typeDocument: any, html: string, files: any) {
    return {
      destination: typeDocument.destination === "GED" ? 0 : 1,
      fromName: typeDocument.email,
      message: "",
      typeDocument: typeDocument.objet,
      participantNumber: this.currentParticipant().numeroParticipant,
      lastName: this.currentParticipant().nom,
      firstName: this.currentParticipant().prenom,
      email: this.currentParticipant().email,
      htmlBody: html,
      socialSecurityNumber: this.currentParticipant().numeroSecuriteSociale,
      birthDate: new Date(
        this.currentParticipant().dateNaissance
      ).toLocaleDateString("fr-FR"),
      vip: this.currentParticipant().vip,
      files: files,
    };
  }

  createHtmlBody(typeDocument: any) {
    const participant = this.currentParticipant();
    const model = this.currentFormValue();
    console.log("formvalue model", model);
    return `
    Gestion des Bénéficiaires Portail
    <br/>\r---------------------------------------------------------------------------------------------------------------
    <br/>\rDonnées Participant\t:<br/>\rType client:\t« Participant »
    <br/>\rNom:\t${participant?.nom}
    <br/>\rPrenom:\t${participant?.prenom}
    <br/>\rDate de naissance:\t${participant?.dateNaissance}
    <br/>\rNo_client_01:\t${participant?.numeroParticipant}
    <br/>\rAdresse email:\t${participant?.email}
    <br/>\r---------------------------------------------------------------------------------------------------------------
    <br/>\rDonnées Bénéficiaire\t:<br/>\rAction:\t${typeDocument.email}
    <br/>\rMotif:\t${model?.reason?.value.replace(/_/g, " ")}
    <br/>\rNom du Bénéficiaire:\t${model?.lastName}
    <br/>\rPrénom du Bénéficiaire:\t${model?.firstName}
    <br/>\rGenre du Bénéficiaire:\t${
      model?.gender === "Male" ? "Masculin" : "Féminin"
    }
    <br/>\rRang de naissance du Bénéficiaire:\t${model?.birthRank}
    <br/>\rNIR du beneficaire:\t${model?.socialSecurityNumber}
    <br/>\rNIR Parent 1 du beneficaire:\t${model?.parent1Ssn}
    <br/>\rNIR Parent 2 du beneficaire:\t${model?.parent2Ssn}
    <br/>\rDate Naissance Bénéficiaire:\t${
      model?.birthDate ? model.birthDate : "Non renseigné"
    }
    <br/>\rStatut télétransmission:\t${
      model?.teletransmission ? "Activé" : "Non activé"
    }
    <br/>\rPremière mutuelle:\t${model?.isCoveredByOtherMutual ? "Oui" : "Non"}
  `;
  }
}
