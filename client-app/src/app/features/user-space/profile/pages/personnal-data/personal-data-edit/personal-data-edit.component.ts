import { Component, effect, inject, Injector, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { IpecaFileUploadComponent } from "../../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { BeneficiaryCguComponent } from "../../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { CommonModule } from "@angular/common";
import { MatRadioModule } from "@angular/material/radio";
import { MatTooltipModule } from "@angular/material/tooltip";
import { IpecaGenre } from "../../../../../../../../../shared-library/src/lib/enumerations/v1/ipecaGenre";
import { FormScrollService } from "../../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { ParticipantFacadeService } from "../../../../../../core/services/participant-facade/participant-facade.service";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { toSignal } from "@angular/core/rxjs-interop";
import { ToastMessageService } from "../../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { ModalService } from "../../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { BeneficiaryInfoBannerComponent } from "../../../../../../components/benificiary/beneficiary-info-banner/beneficiary-info-banner.component";
import { requiredFileValidator } from "../../../../../../../../../shared-library/src/lib/validators/required-file/required-file.validator";

export interface ICountry {
  libelle: string;
  code: string;
}

@Component({
  selector: "app-personal-data-edit",
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatCheckboxModule,
    IpecaFileUploadComponent,
    BeneficiaryCguComponent,
    BeneficiaryInfoBannerComponent,
  ],
  templateUrl: "./personal-data-edit.component.html",
  styleUrl: "./personal-data-edit.component.scss",
})
export class PersonalDataEditComponent {
  sectionName = "ProfileDataForm";
  fb = inject(FormBuilder);
  formScroll = inject(FormScrollService);
  participantFacade = inject(ParticipantFacadeService);
  private toast = inject(ToastMessageService);
  private modalService = inject(ModalService);

  dataForm!: FormGroup;
  currentParticipant = signal<any>(null);
  modificationDate = new Date().toLocaleDateString();

  nameMaxChar = 30;
  firstNameMaxChar = 30;
  appartmentNumberMaxChar = 32;
  buildingMaxChar = 32;
  // pathMaxChar=30
  postalCodeMaxChar = 5;
  cityMaxChar = 26;
  phoneHomeMaxChar = 10;
  phoneMobileMaxChar = 10;

  namePattern = "^(?!s*$).+$";
  civilStateDocRequired = signal<string[]>([]);
  civilStateDocList = ["Etat civil : Copie de la carte d’identité / Passeport"];

  contactDetailsTooltipMessage = signal<string>("");
  contactDetailsMessage =
    "En cas de changement de département, merci de nous transmettre une attestation Sécurité Sociale";

  uploadFileTitle = signal<string>("Pièce(s) jointe(s)");

  readonly notAllowedFields: string[] = [
    "lastName",
    "firstName",
    "maritalStatus",
  ];

  countries = toSignal(this.participantFacade.getAllCountries(), {
    initialValue: [],
  });

  genders = [
    { key: IpecaGenre.Male, value: "Masculin" },
    { key: IpecaGenre.Femelle, value: "Féminin" },
  ];

  maritalStatusList = [
    { key: "Marié(e)", value: "Marié(e)" },
    { key: "PACSé(e)", value: "PACSé(e)" },
    { key: "Célibataire", value: "Célibataire" },
    { key: "Concubin(e)", value: "Concubin(e)" },
    { key: "Veuf(ve)", value: "Veuf(ve)" },
    { key: "Divorcé(e)", value: "Divorcé(e)" },
    { key: "Séparé(e)", value: "Séparé(e)" },
  ];

  ngOnInit(): void {
    this.initializeParticipant();
  }

  initializeParticipant() {
    this.participantFacade.getCurrentParticipant().subscribe(p => {
      this.currentParticipant.set(p);
      this.initializeForm();
    });
  }

  initializeForm() {
    this.dataForm = this.fb.group(
      {
        gender: [this.currentParticipant().genre, [Validators.required]],
        lastName: [
          this.currentParticipant().nom,
          [
            Validators.required,
            Validators.pattern(this.namePattern),
            Validators.maxLength(this.nameMaxChar),
          ],
        ],
        firstName: [
          this.currentParticipant().prenom,
          [
            Validators.required,
            Validators.pattern(this.namePattern),
            Validators.maxLength(this.firstNameMaxChar),
          ],
        ],
        appartmentNumber: [this.currentParticipant().adresse.adresse1],
        building: [this.currentParticipant().adresse.adresse2],
        path: [this.currentParticipant().adresse.adresse3, Validators.required],
        postalCode: [
          this.currentParticipant().adresse.codePostal,
          Validators.required,
        ],
        city: [this.currentParticipant().adresse.ville, Validators.required],
        country: [this.currentParticipant().adresse.pays],
        maritalStatus: [
          this.currentParticipant().situationFamiliale,
          Validators.required,
        ],
        phoneHome: [this.currentParticipant().telephone],
        phoneMobile: [this.currentParticipant().telephonePortable],
        IsCivilStatusChanged: [false],
        IsContantDetailsChanged: [false],
        files: [null],
      },
      { validators: this.atLeastOneChangedValidator }
    );

    this.disableNotAllowedModifiedInput();
  }

  disableNotAllowedModifiedInput() {
    this.notAllowedFields.forEach(field => {
      this.dataForm.get(field)?.disable();
    });
  }

  enableNotAllowedModifiedInput() {
    this.notAllowedFields.forEach(field => {
      this.dataForm.get(field)?.enable();
    });
  }

  atLeastOneChangedValidator(group: FormGroup) {
    const civil = group.get("IsCivilStatusChanged")?.value;
    const contact = group.get("IsContantDetailsChanged")?.value;
    return civil || contact ? null : { atLeastOneRequired: true };
  }

  onStatusSlelected(rowid: any) {}

  onFilesChanged(files: File[]): void {
    console.log("file changed", files);
    this.dataForm.patchValue({
      files: files,
    });
  }

  onCivilStatusChange() {
    const isCivilStatusChanged = this.dataForm.get("IsCivilStatusChanged");
    this.uploadFileTitle.set(
      isCivilStatusChanged?.value
        ? "Pièce(s) jointe(s) *"
        : "Pièce(s) jointe(s) "
    );
    this.civilStateDocRequired.set(
      isCivilStatusChanged?.value ? this.civilStateDocList : []
    );

    if (isCivilStatusChanged?.value) {
      this.dataForm
        .get("files")
        ?.setValidators([Validators.required, requiredFileValidator()]);
    } else {
      this.dataForm.get("files")?.clearValidators();
    }
    this.dataForm.get("files")?.updateValueAndValidity();
  }

  onContactDetailsChange() {
    const isContactDetailsChanged = this.dataForm.get(
      "IsContantDetailsChanged"
    );
    this.contactDetailsTooltipMessage.set(
      isContactDetailsChanged?.value ? this.contactDetailsMessage : ""
    );
  }

  customChangeErrorMessage(): string | null {
    if (!this.dataForm.touched) return null;
    const errors = this.dataForm.errors;
    if (errors && errors["atLeastOneRequired"]) {
      return "Veuillez sélectionner un type de modification";
    }
    return null;
  }

  onSubmit() {
    this.dataForm.markAllAsTouched();
    if (this.dataForm.invalid) {
      this.formScroll.scrollToFirstInvalidControl();
      if (this.dataForm.get("files")?.hasError("required")) {
        this.toast.danger(
          "Pièce(s) jointe(s)",
          "Veuillez insérer une ou plusieurs pièces jointes."
        );
      }
      return;
    }

    const modalData = {
      title: "Données personnelles",
      message: `Êtes-vous sûr(e) de vouloir modifier vos informations ?`,
      confirmText: "Oui",
      cancelText: "Non",
      confirmColor: "warn",
    };
    this.modalService.openConfirmationModal(modalData).subscribe(confirmed => {
      if (confirmed) this.validationConfirmed();
    });
  }

  validationConfirmed() {
    this.enableNotAllowedModifiedInput();
    const customhtmlBody = this.createHtmlBody();
    const payloadDoc = this.createPayloadDoc(customhtmlBody);
    const payload = this.createPayload(payloadDoc);

    this.participantFacade.UpdateData(payload).subscribe(response => {
      this.participantFacade
        .getCurrentParticipant(true)
        .subscribe(participant => {
          this.currentParticipant.set(participant);
        });

      this.participantFacade.clearFiles(this.sectionName);
      this.toast.success(
        "Données personnelles",
        "Vos données personnelles ont bien été mises à jour. ",
        3000,
        () => {
          location.reload();
        }
      );
    });
  }

  createHtmlBody() {
    const participant = this.currentParticipant();
    const model = this.dataForm.value;
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
  Situation familiale:\t${model.FamilySituation}<br/>\r
  Date de modification:\t${
    model.ModificationDate
      ? new Date(model.ModificationDate).toLocaleDateString("fr-FR")
      : ""
  }<br/>\r
  Question:\t
`;
  }

  createPayloadDoc(htmlBody: string) {
    const participant = this.currentParticipant();
    const model = this.dataForm.value;
    return {
      Destination: 0,
      Comment: "",
      FormName: "ModifCoordPerso",
      Subject: [
        model.IsCivilStatusChanged ? "Etat civil" : "",
        model.IsContantDetailsChanged
          ? "Coordonnees postales et telephoniques"
          : "",
      ]
        .filter(Boolean)
        .join(", "),
      NumParticipant: participant.numeroParticipant,
      LastName: model.lastName,
      FirstName: model.firstName,
      NumPlitg: "F001",
      NumDocg: "D001",
      Application: "PARTICIPANT",
      Email: participant.email,
      HtmlBody: htmlBody,
      SocialSecurityNumber: participant.numeroSecuriteSociale,
      Birthdate: new Date(participant.dateNaissance).toLocaleDateString(
        "fr-FR"
      ),
      Vip: participant.vip,
      Files: this.participantFacade.getFiles(this.sectionName),
    };
  }

  createPayload(payloadDoc: any) {
    return {
      NumParticipant: this.currentParticipant().numeroParticipant,
      Genre: this.dataForm?.get("gender")?.value,
      Telephone1: this.dataForm?.get("phoneHome")?.value,
      Telephone2: this.dataForm?.get("phoneMobile")?.value,
      Adresse: {
        adresse1: this.dataForm?.get("appartmentNumber")?.value,
        adresse2: this.dataForm?.get("building")?.value,
        adresse3: this.dataForm?.get("path")?.value,
        ville: this.dataForm?.get("city")?.value,
        pays: this.dataForm?.get("country")?.value,
      },
      SaveDocument: payloadDoc,
    };
  }

  getErrorMessage(controlName: string): string {
    const control = this.dataForm.get(controlName);

    if (!control || !control.errors || !control.touched) return "";

    if (control.hasError("required")) {
      if (controlName === "city") {
        return "Veuillez saisir votre ville";
      } else if (controlName === "postalCode") {
        return "Veuillez saisir votre code postal";
      } else {
        return "Ce champ est obligatoire";
      }
    }

    if (control.hasError("pattern")) {
      return "Format invalide";
    }

    if (control.hasError("maxlength")) {
      return "Nombre de caractère maximal atteint";
    }

    return "Valeur invalide";
  }
}
