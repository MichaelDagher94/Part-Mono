import { Component, inject } from "@angular/core";
import { EnuCorrespondance } from "../../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { JourniesFacadeService } from "../../../journies/facade/journies-facade.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FormScrollService } from "../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { DocumentFacadeService } from "./facade/document/document-facade.service";

@Component({
  selector: "app-portability",
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    IpecaFileUploadComponent,
    BeneficiaryCguComponent,
  ],
  templateUrl: "./portability.component.html",
  styleUrl: "./portability.component.scss",
})
export class PortabilityComponent {
  sectionName = "ProfilePortabilityForm";
  // dependency injection
  private stepFacade = inject(JourniesFacadeService);
  private participantfacade = inject(ParticipantFacadeService);
  private documentFacade = inject(DocumentFacadeService);
  private toast = inject(ToastMessageService);
  private fb = inject(FormBuilder);
  private formScroll = inject(FormScrollService);
  private modal = inject(ModalService);

  // properties
  currentParticipant = toSignal(
    this.participantfacade.getCurrentParticipant(),
    { initialValue: null }
  );
  portabilityForm!: FormGroup;
  typeDocument = EnuCorrespondance.formulaireANI;
  RequestTypeList = toSignal(
    this.stepFacade.getTypeDocumentAsync(this.typeDocument),
    { initialValue: [] }
  );

  constructor() {
    this.initializeForm();
  }

  // methods
  initializeForm() {
    this.portabilityForm = this.fb.group({
      requestType: [null, Validators.required],
      file: [null, Validators.required],
    });
  }

  onFilesChanged(files: File[]): void {
    console.log("file changed", files);
    this.portabilityForm.patchValue({
      file: files,
    });
  }

  onSubmit() {
    this.portabilityForm.markAllAsTouched();
    if (this.portabilityForm.invalid) {
      this.invalidAction();
      return;
    }
    this.validAction();
  }

  private invalidAction() {
    if (!this.portabilityForm.get("file")?.value) {
      this.toast.warning(
        "Attention",
        "Veuillez nous fournir la ou les pièce(s)-justificative(s) demandée(s) "
      );
    }
    this.formScroll.scrollToFirstInvalidControl();
  }

  private validAction() {
    const modalData = {
      title: "Portabilité",
      message: `Êtes-vous sûr(e) de vouloir transmettre cette demande ?`,
      confirmText: "Confirmer",
      cancelText: "Annuler",
      confirmColor: "warn",
    };

    this.modal.openConfirmationModal(modalData).subscribe(confirmed => {
      if (confirmed) this.sendConfirmation();
    });
  }
  sendConfirmation() {
    const payload = this.createPayload();
    this.documentFacade.submitDocument(payload).subscribe({
      next: response => {
        if (response.isSuccess) {
          this.participantfacade.getCurrentParticipant(true);
          this.toast.success(
            "Succès",
            " Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion ",
            3000,
            () => {
              location.reload();
            }
          );
        }
      },
      error: error => {
        this.toast.danger(
          "Erreur",
          "Une erreur est survenue lors de l’enregistrement de votre demande. Nous vous invitons à la renouveler ultérieurement "
        );
      },
    });
  }

  createHtmlBody() {
    return (
      "Beneficiaire:\ttitulaire<br/>\rTYPE:\tParticipant" +
      "<br/>\rNom:\t" +
      this.currentParticipant().nom +
      "<br/>\rPrenom:\t" +
      this.currentParticipant().prenom +
      "<br/>\rDate de naissance:\t" +
      this.currentParticipant().dateNaissance +
      "<br/>\rEmail:\t" +
      this.currentParticipant().email +
      "<br/>\rno_client_01:\t" +
      this.currentParticipant().numeroParticipant +
      "<br/>\rno_client_02:\t" +
      this.currentParticipant().numeroSecuriteSociale
    );
  }
  createPayload(): any {
    const participant = this.currentParticipant();
    const typeDocument = this.portabilityForm.get("requestType")?.value;
    const htmlBody = this.createHtmlBody();
    const files = this.portabilityForm.get("file")?.value;

    return {
      destination: typeDocument.destination === "GED" ? 0 : 1,
      message: this.portabilityForm.get("message")?.value || "",
      fromName: "Formulaire Portabilité",
      typeDocument: typeDocument.objet,
      participantNumber: participant.numeroParticipant,
      lastName: participant.nom,
      firstName: participant.prenom,
      email: participant.email,
      htmlBody: htmlBody,
      socialSecurityNumber: participant.numeroSecuriteSociale,
      birthDate: new Date(participant.dateNaissance).toLocaleDateString(
        "fr-FR"
      ),
      vip: participant.vip,
      files: files.name,
    };
  }

  getErrorMessage(controlName: string): string {
    const control = this.portabilityForm.get(controlName);

    if (!control || !control.errors || !control.touched) return "";

    if (control.hasError("required")) {
      return controlName === "requestType"
        ? "Veuillez saisir le type de demande"
        : "Ce champ est obligatoire";
    }

    return "Valeur invalide";
  }
}
