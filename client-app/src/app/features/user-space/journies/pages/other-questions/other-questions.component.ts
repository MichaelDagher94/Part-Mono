import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { take } from "rxjs";
import { EnuCorrespondance } from "../../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { DocumentFacadeService } from "../../facade/document-facade/document-facade.service";
import { JourniesFacadeService } from "../../facade/journies-facade.service";
import { FormScrollService } from "../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { AutofocusDirective } from "../../../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";

@Component({
  selector: "app-other-questions",
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
  templateUrl: "./other-questions.component.html",
  styleUrl: "./other-questions.component.scss",
})
export class OtherQuestionsComponent {
  sectionName = "InformationRequestStepForm";
  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  toast = inject(ToastMessageService);
  stepFacade = inject(JourniesFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  documentFacade = inject(DocumentFacadeService);
  private formScroll = inject(FormScrollService);

  maxLength = 400;

  typeDocument = EnuCorrespondance.sante_Demande_Information;
  reimbursementTypeList = signal<any[]>([]);

  currentParticipant = signal<any>(null);
  selectedReimbursementType = signal<any>(null);
  referenceHelp =
    ` Où trouver le numéro de dossier ? 
    – Dans l’accusé de réception du mail 
    –\n Suite à un courrier d’un gestionnaire `;

  form = this.fb.group({
    reference: ["", Validators.maxLength(30)],
    type: ["", Validators.required],
    documents: [[] as File[], Validators.required],
    comments: ["", Validators.maxLength(400)],
  });

  ngOnInit(): void {
    this.initializeData();
    this.initializeCurrentParticipant();
  }

  initializeCurrentParticipant() {
    this.participantFacade.getCurrentParticipant().subscribe(participant => {
      this.currentParticipant.set(participant);
    });
  }

  initializeData() {
    this.stepFacade
      .getTypeDocumentAsync(this.typeDocument)
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.reimbursementTypeList.set(res);
        }
      });
  }

  ontypeSelected(data: any) {
    this.selectedReimbursementType.set(data.value);
  }

  onFileSelected(files: File[]) {
    this.form.patchValue({ documents: files });
  }
  createPayload(customHtmlBody: string) {
    return {
      destination:
        this.selectedReimbursementType().destination === "GED" ? 0 : 1,
      fromName: this.selectedReimbursementType().email,
      message: this.form.get("comments")?.value,
      typeDocument: this.selectedReimbursementType().objet,
      participantNumber: this.currentParticipant().numeroParticipant,
      lastName: this.currentParticipant().nom,
      firstName: this.currentParticipant().prenom,
      email: this.currentParticipant().email,
      htmlBody: customHtmlBody,
      socialSecurityNumber: this.currentParticipant().numeroSecuriteSociale,
      vip: this.currentParticipant().vip,
      files: this.stepFacade.getFiles(this.sectionName),
    };
  }
  createHtmlBody() {
    const participant = this.currentParticipant();
    const model = this.form.value;
    return `
  Beneficiaire:\ttitulaire<br/>\r
  TYPE:\tParticipant<br/>\r
  Nom:\t${participant.nom}<br/>\r
  Prenom:\t${participant.prenom}<br/>\r
  Date de naissance:\t${new Date(participant.dateNaissance).toLocaleDateString(
    "fr-FR"
  )}<br/>\r
  Email:\t${participant.email}<br/>\r
  no_client_01:\t${participant.numeroParticipant}<br/>\r
  no_client_02:\t${participant.numeroSecuriteSociale}<br/>\r
  Message:\t${model.comments}<br/>\r
  Numéro de référence à rappeler:\t${model.reference}<br/>\r

`;
  }

  onSubmit() {
    if (this.form.invalid) {
      if (!this.form.get("files")?.value) {
        this.toast.danger(
          "Attention",
          "Veuillez nous fournir la ou les pièce(s) justificative(s) demandée(s). "
        );
      }
      this.formScroll.scrollToFirstInvalidControl();
      return;
    }
    const modalData = {
      title: "Demande d’information",
      message: `Êtes-vous sûr(e) de vouloir transmettre cette demande ?`,
      confirmText: "Oui",
      cancelText: "Non",
      confirmColor: "warn",
    };
    this.modalService.openConfirmationModal(modalData).subscribe(confirmed => {
      if (confirmed) this.validationConfirmed();
    });
  }

  validationConfirmed() {
    const customHtmlBody = this.createHtmlBody();
    const constPayload = this.createPayload(customHtmlBody);
    this.documentFacade.saveDocument(constPayload).subscribe(res => {
      this.resetAll();
      this.toast.success(
        "Succès",
        "Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion ",
        3000,
        () => location.reload()
      );
    });
  }

  resetAll() {
    this.form.reset();
    this.form.reset({
      type: null,
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.stepFacade.clearFiles(this.sectionName);
  }
}
