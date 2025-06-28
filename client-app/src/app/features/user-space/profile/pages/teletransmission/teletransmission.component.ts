import { Component, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { map } from "rxjs";
import { EnuCorrespondance } from "../../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { BeneficiaryInfoBannerComponent } from "../../../../../components/benificiary/beneficiary-info-banner/beneficiary-info-banner.component";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { JourniesFacadeService } from "../../../journies/facade/journies-facade.service";
import { DocumentFacadeService } from "./facade/document-facade.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";

@Component({
  selector: "app-teletransmission",
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    IpecaFileUploadComponent,
    BeneficiaryCguComponent,
    BeneficiaryInfoBannerComponent,
  ],
  templateUrl: "./teletransmission.component.html",
  styleUrl: "./teletransmission.component.scss",
})
export class TeletransmissionComponent {
  sectionName = "ProfileTeletransmissionForm";
  infoBulle =
    'Pour mettre fin à la télétransmission des décomptes de santé entre IPECA et votre centre CPAM, rendez-vous dans la section "Mes démarches", sélectionnez "Autres questions", puis "Télétransmission"';

  participantFacade = inject(ParticipantFacadeService);
  private stepFacade = inject(JourniesFacadeService);
  private documentFacade = inject(DocumentFacadeService);
  private toast = inject(ToastMessageService);
  private modalService = inject(ModalService);
  fb = inject(FormBuilder);

  formGroup!: FormGroup;
  typeDocument = EnuCorrespondance.teleTransmission;
  RequestTypeList = toSignal(
    this.stepFacade.getTypeDocumentAsync(this.typeDocument),
    { initialValue: [] }
  );
  requestType = signal<any>(null);
  displaycheckBox = signal<boolean>(false);
  displayFileUpload = signal<boolean>(false);
  requiredDocuments = signal<string[]>([
    "Veuillez nous joindre votre attestation de sécurité sociale",
  ]);

  currentParticipant = signal<any>(null);

  ngOnInit(): void {
    this.participantFacade
      .getCurrentParticipant()
      .pipe(
        map(participant => ({
          ...participant,
          dateNaissance: new Date(
            participant.dateNaissance
          ).toLocaleDateString(),
        }))
      )
      .subscribe(participant => {
        this.currentParticipant.set(participant);
        this.initializeFormGroup();
      });
  }

  initializeFormGroup() {
    this.formGroup = this.fb.group({
      teletransmission: [false],
      file: [null],
    });
  }

  onChecked(event: any) {
    this.formGroup.get("teletransmission")?.setValue(event.checked);
    this.displayFileUpload.set(event.checked);
    this.requestType.set(this.RequestTypeList()[0]);
  }

  onFilesChanged(files: File[]): void {
    this.formGroup.patchValue({
      file: files,
    });
  }

  onEditTeletransmission() {
    this.displaycheckBox.set(!this.displaycheckBox());
  }

  onSubmit() {
    console.log("Form submitted", this.formGroup.value);
    if (this.formGroup.valid) {
      this.confirmationDialog();
    }
  }

  confirmationDialog() {
    const modalData = {
      title: "Télétransmission",
      message: ` Etes vous sûr de vouloir transmettre ce document ?`,
      confirmText: "Oui",
      cancelText: "Non",
      confirmColor: "warn",
    };
    this.modalService.openConfirmationModal(modalData).subscribe(confirmed => {
      if (confirmed) {
        const payload = this.createPayload();
        this.documentFacade.saveDocument(payload).subscribe({
          next: res => {
            if (res.isSuccess) {
              this.participantFacade.getCurrentParticipant(true);
              this.documentFacade.clearFiles(this.sectionName);
              this.toast.success(
                "Télétransmission",
                "Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion"
              );
            } else this.displayErrorMessage();
          },
          error: err => {
            this.displayErrorMessage();
          },
        });
      }
    });
  }

  displayErrorMessage() {
    this.toast.danger(
      "Télétransmission",
      "Une erreur est survenue lors de l’enregistrement de votre demande. Nous vous invitons à la renouveler ultérieurement"
    );
  }
  createPayload() {
    return {
      destination: this.requestType().destination === "GED" ? 0 : 1,
      fromName: "Formulaire Teletransmission",
      message: "",
      typeDocument: this.requestType().objet,
      participantNumber: this.currentParticipant().numeroParticipant,
      lastName: this.currentParticipant().nom,
      firstName: this.currentParticipant().prenom,
      email: this.currentParticipant().email,
      birthDate: this.currentParticipant().dateNaissance,
      htmlBody: this.createHtml(this.currentParticipant()),
      socialSecurityNumber: this.currentParticipant().numeroSecuriteSociale,
      vip: this.currentParticipant().vip,
      files: this.documentFacade.getFiles(this.sectionName),
    };
  }

  createHtml(participant: any) {
    return `
      Beneficiaire: titulaire<br/>
      TYPE: Participant<br/>
      Nom: ${participant.nom}<br/>
      Prenom: ${participant.prenom}<br/>
      Date de naissance: ${participant.dateNaissance}<br/>
      Email: ${participant.email}<br/>
      no_client_01: ${participant.numeroParticipant}<br/>
      no_client_02: ${participant.numeroSecuriteSociale}
    `;
  }
}
