import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FormScrollService } from "../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { DocumentFacadeService } from "../../facade/document-facade/document-facade.service";
import { JourniesFacadeService } from "../../facade/journies-facade.service";
import { EnuCorrespondance } from "../../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { toSignal } from "@angular/core/rxjs-interop";
import { AutofocusDirective } from "../../../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";

@Component({
  selector: "app-proof-provider",
  imports: [
    IpecaFileUploadComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    BeneficiaryCguComponent,
    AutofocusDirective,
  ],
  templateUrl: "./proof-provider.component.html",
  styleUrl: "./proof-provider.component.scss",
})
export class ProofProviderComponent {
  sectionName = "SupportDocumentForesightStepForm";
  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  toast = inject(ToastMessageService);
  stepFacade = inject(JourniesFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  documentFacade = inject(DocumentFacadeService);
  private formScroll = inject(FormScrollService);

  typeDocument = EnuCorrespondance.prevoyance_Justificatif;
  currentSelectedProof = signal<any>(null);
  proofList = toSignal(
    this.stepFacade.getTypeDocumentAsync(this.typeDocument),
    { initialValue: [] }
  );

  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant(),
    { initialValue: null }
  );

  referenceHelp =
    ` Où trouver le numéro de dossier ? 
    – Dans l’accusé de réception du mail 
    –\n Suite à un courrier d’un gestionnaire `;

  form = this.fb.group({
    reference: ["", Validators.maxLength(30)],
    type: ["", Validators.required],
    documents: [[] as File[], Validators.required],
  });

  ontypeSelected(data: any) {
    this.currentSelectedProof.set(data.value);
    console.log(data.value);
  }
  onFileSelected(files: File[]) {
    this.form.patchValue({ documents: files });
  }

  createPayload(): any {
    const participant = this.currentParticipant();
    const htmlBody = this.createHtmlBody();
    const files = this.form.get("documents")?.value;

    return {
      destination: this.currentSelectedProof().destination === "GED" ? 0 : 1,
      message: this.form.get("message")?.value || "",
      fromName: "Formulaire Transmission de justificatif",
      typeDocument: this.currentSelectedProof().objet,
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
      files: this.stepFacade.getFiles(this.sectionName),
    };
  }
  private validAction() {
    const modalData = {
      title: "Transmettre un justificatif",
      message: `Etes vous sûr(e) de vouloir transmettre cette demande ?`,
      confirmText: "Confirmer",
      cancelText: "Annuler",
      confirmColor: "warn",
    };

    this.modalService.openConfirmationModal(modalData).subscribe(confirmed => {
      if (confirmed) this.sendConfirmation();
    });
  }
  private invalidAction() {
    if (!this.form.get("file")?.value) {
      this.toast.warning(
        "Attention",
        "Veuillez nous fournir la ou les pièce(s)-justificative(s) demandée(s) "
      );
    }
    this.formScroll.scrollToFirstInvalidControl();
  }

  sendConfirmation() {
    const payload = this.createPayload();
    this.documentFacade.saveDocument(payload).subscribe({
      next: response => {
        if (response.isSuccess) {
          this.resetAll();
          this.toast.success(
            "Transmettre un justificatif",
            " Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion ",
            3000
            // () => location.reload()
          );
        }
      },
      error: error => {
        this.toast.danger(
          "Transmettre un justificatif",
          "Une erreur est survenue lors de l’enregistrement de votre demande. Nous vous invitons à la renouveler ultérieurement "
        );
      },
    });
  }

  createHtmlBody(): string {
    const participant = this.currentParticipant();
    const reference = this.form.get("reference")?.value;
    const htmlBody = `
      Beneficiaire: titulaire<br/>
      TYPE: Participant<br/>
      Nom: ${participant.nom}<br/>
      Prenom: ${participant.prenom}<br/>
      Date de naissance: ${participant.dateNaissance}<br/>
      Email: ${participant.email}<br/>
      no_client_01: ${participant.numeroParticipant}<br/>
      no_client_02: ${participant.numeroSecuriteSociale}<br/>
      Numéro de référence à rappeler: ${reference}
    `;
    return htmlBody;
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.invalidAction();
      return;
    }
    this.validAction();
  }

  resetAll() {
    this.form.reset();
    this.form.markAsUntouched();
    this.stepFacade.clearFiles(this.sectionName);
  }
}
