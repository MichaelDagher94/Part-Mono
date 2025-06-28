import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { BeneficiaryCguComponent } from "../../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormScrollService } from "../../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { ParticipantFacadeService } from "../../../../../../core/services/participant-facade/participant-facade.service";
import { IpecaFileUploadComponent } from "../../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { ToastMessageService } from "../../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { ModalService } from "../../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { catchError, of } from "rxjs";
import { MyDocumentsFacadeService } from "../../../facade/my-documents-facade.service";
import { BeneficiaryInfoBannerComponent } from "../../../../../../components/benificiary/beneficiary-info-banner/beneficiary-info-banner.component";

@Component({
  selector: "app-bank-details-edit",
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    CommonModule,
    BeneficiaryCguComponent,
    IpecaFileUploadComponent,
    BeneficiaryInfoBannerComponent,
  ],
  templateUrl: "./bank-details-edit.component.html",
  styleUrl: "./bank-details-edit.component.scss",
})
export class BankDetailsEditComponent {
  sectionName = "ProfileBankForm";
  dataForm!: FormGroup;
  fb = inject(FormBuilder);
  formScroll = inject(FormScrollService);
  participantFacade = inject(ParticipantFacadeService);
  documentFacade = inject(MyDocumentsFacadeService);
  private modalService = inject(ModalService);

  private toast = inject(ToastMessageService);
  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant().pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    ),
    { initialValue: null }
  );

  domiciliationMaxChar = 30;
  titulaireMaxChar = 30;
  ibanMaxChar = 27;
  bicwsiftMaxChar = 11;
  requiredDocuments = ["relevé d'identité bancaire (RIB)"];

  initializeForm() {
    this.dataForm = this.fb.group({
      domiciliation: [
        this.currentParticipant().domiciliation,
        [Validators.required],
      ],
      titulaire: [this.currentParticipant().titulaire, [Validators.required]],
      iban: [this.currentParticipant().iban, [Validators.required]],
      bicwsift: [this.currentParticipant().bic, [Validators.required]],
      files: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  getErrorMessage(controlName: string): string {
    const control = this.dataForm.get(controlName);

    if (
      !control ||
      !control.errors ||
      (!control.touched && !this.dataForm.touched)
    ) {
      return "";
    }

    if (control.hasError("required")) {
      return "Ce champ est obligatoire";
    }

    return "Valeur invalide";
  }

  onFilesChanged(files: File[]): void {
    console.log("file changed", files);
    this.dataForm.patchValue({
      files: files,
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      if (!this.dataForm.get("files")?.value) {
        console.log(this.dataForm.get("files")?.value);
        this.toast.info(
          "Info",
          "Veuillez choisir le fichier correspondant à votre demande"
        );
      }
      this.formScroll.scrollToFirstInvalidControl();
      return;
    }
    const modalData = {
      title: "Coordonnées bancaires",
      message: `Etes-vous sûr de vouloir modifier vos coordonnées bancaires ?`,
      confirmText: "Oui",
      cancelText: "Non",
      confirmColor: "warn",
    };
    this.modalService.openConfirmationModal(modalData).subscribe(confirmed => {
      if (confirmed) this.validationConfirmed();
    });
  }
  // validationConfirmed() {
  //   const payload = this.createPayload();
  //   console.log(payload);

  //   this.participantFacade
  //     .updateBankInfo(payload)
  //     .subscribe((response: any) => {
  //       console.log("Response from updateBankInfo:", response);
  //       this.toast.success(
  //         "Succès",
  //         "Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion ",
  //         3000,
  //         () => {
  //           // location.reload();
  //         }
  //       );
  //     });
  // }
  validationConfirmed() {
    const payload = this.createPayload();
    console.log(payload);

    this.documentFacade.updateIban(payload).subscribe((response: any) => {
      console.log("Response from updateIban:", response);
      const strmaj = this.getStrmaj(response.data);
      const email = response.data.email.replace(
        "@ipeca-prevoyance.fr",
        "@ipeca.fr"
      );
      const htmlBody = this.createBankIbanHtml(payload, strmaj);
      const docPayload = this.createDocPayload(
        {
          email: email,
          objet: response.data.objet,
        },
        this.currentParticipant(),
        htmlBody,
        this.documentFacade.getFiles(this.sectionName)
      );
      this.documentFacade.submitDocumentStep(docPayload).subscribe({
        next: value => {
          this.documentFacade.clearFiles(this.sectionName);
          this.toast.success(
            "Coordonnées bancaires",
            "Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion.",
            3000,
            () => {
              location.reload();
            }
          );
        },
        error: err => {},
      });
    });
  }

  createDocPayload(
    trtIban: any,
    participant: any,
    htmlBody: string,
    files: any
  ) {
    return {
      step: 0,
      email: trtIban.email,
      objet: `Multi-RIB bénéficiaire: ${participant.numeroParticipant}`,
      objetComplement: trtIban.objet,
      numeroParticipant: participant.numeroParticipant,
      nom: participant.nom,
      prenom: participant.prenom,
      emailParticipant: participant.email,
      htmlBody: htmlBody,
      numeroSecuriteSociale: participant.numeroSecuriteSociale,
      dateNaissance: participant.dateNaissance
        ? new Date(participant.dateNaissance).toLocaleDateString("fr-FR")
        : "",
      vip: participant.vip,
      files: files,
    };
  }
  createPayload() {
    const data = this.dataForm.value;
    return {
      ...this.currentParticipant(),
      banqueInfo: {
        domiciliation: data.domiciliation,
        titulaire: data.titulaire,
        iban: data.iban,
        bicSwift: data.bicwsift,
      },
      iban: data.iban,
      origine: "IPECA",
      domiciliation: data.domiciliation,
      titulaire: data.titulaire,
      bic: data.bicwsift,
      bicSwift: data.bicwsift,
      file: this.documentFacade.getFiles(this.sectionName),
    };
  }

  private getStrmaj(trtIban: any): string {
    if (trtIban?.email) {
      trtIban.email = trtIban.email.replace(
        "@ipeca-prevoyance.fr",
        "@ipeca.fr"
      );
    }

    const wsCode = trtIban?.wS_CODE_RETOUR;
    const majdb = trtIban?.majdb;
    console.log("WS_CODE_RETOUR:", wsCode);
    console.log("majdb:", majdb);

    if (wsCode === "00") {
      if (majdb === "O" || majdb === "N") {
        return majdb;
      }
    } else if (wsCode === "10") {
      return "N";
    }

    return "";
  }

  private createBankIbanHtml(data: any, strmaj: any): string {
    return `
    Domiciliation: ${data.banqueInfo.domiciliation}<br>
    TitulaireCompte: ${data.banqueInfo.titulaire}<br>
    Bic: ${data.bicSwift}<br>
    MultiRib Beneficiaire: ${data.numeroParticipant}<br>
    Plus de 3 mois: ${strmaj}<br>
    iban: ${data.banqueInfo.iban}<br>
    `;
  }
}
