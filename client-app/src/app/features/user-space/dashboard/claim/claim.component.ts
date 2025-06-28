import { Component, inject, signal } from "@angular/core";
import { EnuCorrespondance } from "../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormScrollService } from "../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { ModalService } from "../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { ClaimFacadeService } from "./facade/claim-facade.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AutofocusDirective } from "../../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";
import { BeneficiaryCguComponent } from "../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { IpecaFileUploadComponent } from "../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { map } from "rxjs";

@Component({
  selector: "app-claim",
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
  templateUrl: "./claim.component.html",
  styleUrl: "./claim.component.scss",
})
export class ClaimComponent {
  sectionName = "InformationRequestForesightStepForm";
  fromName = "InformationRequestForesightStep";
  modalTitle = "Réclamation";
  referenceHelp =` Où trouver le numéro de dossier ? 
    – Dans l’accusé de réception du mail 
    – Suite à un courrier d’un gestionnaire `;

  fb = inject(FormBuilder);
  private formScroll = inject(FormScrollService);
  modalService = inject(ModalService);
  toast = inject(ToastMessageService);
  claimFacade = inject(ClaimFacadeService);

  typeDocument = EnuCorrespondance.formulaireReclamation;
  currentSelectedProof = signal<any>(null);

  proofList = toSignal(
    this.claimFacade
      .getTypeDocumentAsync(this.typeDocument)
      .pipe(
        map(list => [
          ...list.filter((item: any) => item.typeDocument !== "Autres"),
          ...list.filter((item: any) => item.typeDocument === "Autres"),
        ])
      ),
    { initialValue: [] }
  );

  currentParticipant = toSignal(this.claimFacade.getCurrentParticipant(), {
    initialValue: null,
  });

  form = this.fb.group({
    reference: ["", Validators.maxLength(30)],
    type: ["", Validators.required],
    message: ["", Validators.required],
    documents: [[] as File[], Validators.required],
  });

  ontypeSelected(data: any) {
    this.currentSelectedProof.set(data.value);
    console.log(data.value);
  }
  onFileSelected(files: File[]) {
    this.form.patchValue({ documents: files });
  }

  private validAction() {
    const modalData = {
      title: this.modalTitle,
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

  createPayload(): any {
    const participant = this.currentParticipant();
    const htmlBody = this.createHtmlBody();
    const files = this.form.get("documents")?.value;

    return {
      destination: this.currentSelectedProof().destination === "GED" ? 0 : 1,
      message: this.form.get("message")?.value || "",
      fromName: "Formulaire de demande d’information",
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
      files: this.claimFacade.getFiles(this.sectionName),
    };
  }

  sendConfirmation() {
    const payload = this.createPayload();
    this.claimFacade.saveDocument(payload).subscribe({
      next: response => {
        if (response.isSuccess) {
          this.resetAll();
          this.toast.success(
            this.modalTitle,
            " Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion ",
            3000,
            () => location.reload()
          );
        }
      },
      error: error => {
        this.toast.danger(
          this.modalTitle,
          "Erreur interne, veuillez réessayer ultérieurement! "
        );
      },
    });
  }

  createHtmlBody(): string {
    const participant = this.currentParticipant();
    const reference = this.form.get("reference")?.value;
    const message = this.form.get("message")?.value || "";
    const htmlBody = `
      Beneficiaire: titulaire<br/>
      TYPE: Participant<br/>
      Nom: ${participant.nom}<br/>
      Prenom: ${participant.prenom}<br/>
      Date de naissance: ${participant.dateNaissance}<br/>
      Email: ${participant.email}<br/>
      no_client_01: ${participant.numeroParticipant}<br/>
      no_client_02: ${participant.numeroSecuriteSociale}<br/>
      commentaire: ${message}<br/>
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
    this.claimFacade.clearFiles(this.sectionName);
  }
}
