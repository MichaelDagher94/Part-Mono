import { Component, inject, OnInit, signal } from "@angular/core";
import { BeneficiaryInfoBannerComponent } from "../../../../../components/benificiary/beneficiary-info-banner/beneficiary-info-banner.component";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { JourniesFacadeService } from "../../facade/journies-facade.service";
import { EnuCorrespondance } from "../../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { take } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { DatePipe } from "@angular/common";
import { DocumentFacadeService } from "../../facade/document-facade/document-facade.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { FormScrollService } from "../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { AutofocusDirective } from "../../../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";

@Component({
  selector: "app-reimbursement-request",
  providers: [DatePipe],
  imports: [
    BeneficiaryInfoBannerComponent,
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
  templateUrl: "./reimbursement-request.component.html",
  styleUrl: "./reimbursement-request.component.scss",
})
export class ReimbursementRequestComponent implements OnInit {
  sectionName = "RefundStepForm";
  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  toast = inject(ToastMessageService);
  stepFacade = inject(JourniesFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  documentFacade = inject(DocumentFacadeService);
  datePipe = inject(DatePipe);
  private formScroll = inject(FormScrollService);

  maxLength = 400;

  typeDocument = EnuCorrespondance.sante_Remboursement;
  reimbursementTypeList = signal<any[]>([]);

  currentParticipant = signal<any>(null);
  selectedReimbursementType = signal<any>(null);
  referenceHelp =
    ` Où trouver le numéro de dossier ? 
    – Dans l’accusé de réception du mail 
    –\n Suite à un courrier d’un gestionnaire `;

  fileToUploadList = [
    {
      id: 8204,
      typeDocument: "Médecines Douces",
      message: "Se référer à votre notice",
    },
    {
      id: 8205,
      typeDocument: "Panier d’automédication",
      message: "Se référer à votre notice",
    },
    {
      id: 8207,
      typeDocument: "Soins courants",
      message:
        "Pharmacie, consultations et soins Externes, imagerie Médicale, analyses biologiques et laboratoires, auxiliaires médicaux",
    },
  ];
  bannerUploadFileList = signal<any[]>([]);

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

  onTypeSelected(row: any | null) {
    this.selectedReimbursementType.set(row);
    const selected = this.fileToUploadList.find(item => item.id == row.id);
    this.bannerUploadFileList.set(selected ? [selected.message] : []);
  }

  onFileSelected(files: File[]) {
    this.form.patchValue({ documents: files });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.formScroll.scrollToFirstInvalidControl();
      if (this.form.get("documents")?.invalid) {
        this.toast.danger(
          "Remboursement",
          "Veuillez ajouter un document valide"
        );
      }
      return;
    }
    if (this.form.valid) {
      const modalData = {
        title: "Remboursement ",
        message: `Êtes-vous sûr(e) de vouloir transmettre cette demande ?`,
        confirmText: "Oui",
        cancelText: "Non",
        confirmColor: "warn",
      };

      this.modalService
        .openConfirmationModal(modalData)
        .subscribe(confirmed => {
          if (confirmed) {
            const participantBirthDate = this.datePipe.transform(
              this.currentParticipant().dateNaissance,
              "dd/MM/yyyy"
            );
            const htmlBody =
              `Beneficiaire:\ttitulaire<br/>\nTYPE:\tParticipant` +
              `<br/>\nNom:\t${this.currentParticipant().nom}` +
              `<br/>\nPrenom:\t${this.currentParticipant().prenom}` +
              `<br/>\nDate de naissance:\t${participantBirthDate}` +
              `<br/>\nEmail:\t${this.currentParticipant().email}` +
              `<br/>\nno_client_01:\t${
                this.currentParticipant().numeroParticipant
              }` +
              `<br/>\nno_client_02:\t${
                this.currentParticipant().numeroSecuriteSociale
              }` +
              `<br/>\nQuestion:\t<br/>\nCommentaire:\t${
                this.form.get("comments")?.value
              }` +
              `<br/>\nNuméro de référence à rappeler ?:\t${
                this.form.get("reference")?.value
              }`;

            const payload = this.createPayload(htmlBody, participantBirthDate);
            this.documentFacade.saveDocument(payload).subscribe(() => {
              this.resetAll();
              this.toast.success(
                "Remboursement",
                "Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion.",
                3000,
                () => location.reload()
              );
            });
          }
        });
    }
  }

  createPayload(customHtmlBody: string, dateNaissance: any) {
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
      birthDate: dateNaissance,
      vip: this.currentParticipant().vip,
      files: this.stepFacade.getFiles(this.sectionName),
    };
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
