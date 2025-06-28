import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  DestroyRef,
  inject,
  LOCALE_ID,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { map, take, tap } from "rxjs";
import { CustomDateAdapter } from "../../../../../../../../shared-library/src/lib/adapters/custom-date-adapters";
import { DateInputMaskDirective } from "../../../../../../../../shared-library/src/lib/directive/mask-date.directive";
import { EnuCorrespondance } from "../../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { BeneficiaryRequest } from "../../../../../../../../shared-library/src/lib/models/beneficiary/request/BeneficiaryRequest";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { AuthenticationService } from "../../../../../../../../shared-library/src/lib/services/authentication/authentication.service";
import { BeneficiaryService } from "../../../../../../../../shared-library/src/lib/services/beneficiary/beneficiary.service";
import { FormScrollService } from "../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";

import { AutofocusDirective } from "../../../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";
import { IpecaGenre } from "../../../../../../../../shared-library/src/lib/enumerations/v1/ipecaGenre";
import { MY_DATE_FORMATS } from "../../../../../../../../shared-library/src/lib/models/date/custom-date-format";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { franceSocialSecurityValidator } from "../../../../../../../../shared-library/src/lib/validators/FrenchSocialValidators/french-social-ssn.validators";
import { requiredFileValidator } from "../../../../../../../../shared-library/src/lib/validators/required-file/required-file.validator";
import { checkAge } from "../../../../../components/benificiary/beneficary-add-form/services/beneficiary-add-form.service";
import { STATE } from "../../../../../components/benificiary/beneficary-add-form/state/beneficiary.state";
import { requiredSelectionValidator } from "../../../../../components/benificiary/beneficary-add-form/validators/beneficiary.validatior";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { BeneficiaryInfoBannerComponent } from "../../../../../components/benificiary/beneficiary-info-banner/beneficiary-info-banner.component";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { DocumentFacadeService } from "../../../journies/facade/document-facade/document-facade.service";
import { JourniesFacadeService } from "../../../journies/facade/journies-facade.service";
import { BeneficiaryFacadeService } from "../../facades/beneficiary-facade.service";

@Component({
  selector: "app-beneficiary-edit-page",
  providers: [
    DatePipe,
    provideNgxMask(),
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: LOCALE_ID, useValue: "fr-FR" },
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    NgxMaskDirective,
    IpecaFileUploadComponent,
    BeneficiaryCguComponent,
    DateInputMaskDirective,
    BeneficiaryInfoBannerComponent,
    AutofocusDirective,
  ],
  templateUrl: "./beneficiary-edit-page.component.html",
  styleUrl: "./beneficiary-edit-page.component.scss",
})
export class BeneficiaryEditPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private readonly beneficiaryService = inject(BeneficiaryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthenticationService);
  private modalService = inject(ModalService);
  router = inject(Router);

  isBtnTeletransmissionEnabled = true;

  private beneficiaryFacade = inject(BeneficiaryFacadeService);

  private currentParticipant = toSignal(
    this.beneficiaryFacade.getCurrentParticipant(),
    { initialValue: null }
  );

  documentFacade = inject(DocumentFacadeService);
  datePipe = inject(DatePipe);
  stepFacade = inject(JourniesFacadeService);
  private toast = inject(ToastMessageService);
  private formScroll = inject(FormScrollService);

  genders = STATE.genders;
  sectionName = "EditBeneficiaryForm";

  showTeletransmission: boolean = false;
  beneficiaryForm!: FormGroup;
  connectedUser = signal<any>(null);
  currentBeneficiary = signal<any>(null);
  beneficiaryId = signal<any>(null);

  reasonList = signal<any[]>([]);
  typeDocument = EnuCorrespondance.beneficiaire_Modification;

  infoBannerTitle = signal<string>("");
  currentReason = signal<any>("");
  requiredDocuments = signal<any[]>([]);

  SSN_PATTERN = STATE.ssnPattern;
  SSN_MASK = STATE.ssnMask;
  MAJOR_AGE = STATE.majorAge;
  isAdult = signal(true);

  nssInfo = STATE.ssnInfo;
  rattachementInfo = STATE.rattachementSSInfo;
  motiveInfo = STATE.motiveInfo;
  birthRank = STATE.birthRange;
  maxName = 30;
  maxFirstName = 15;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // const id = this.route.snapshot.params["id"];
    const id = history.state.id || null;
    if (!id) {
      this.router.navigate(["mes-beneficiaires"]);
    }
    this.beneficiaryId.set(id);

    this.initEmptyForm();
    this.initializeData();
    if (this.beneficiaryId()) this.loadConnectedUser();
  }

  private initEmptyForm(): void {
    this.beneficiaryForm = this.fb.group({
      gender: [null, Validators.required],
      lastName: ["", [Validators.required, Validators.maxLength(30)]],
      firstName: ["", [Validators.required, Validators.maxLength(15)]],
      birthDate: ["", [Validators.required]],
      birthRank: [this.birthRank[0]],
      familyRelationShip: [],
      updateDate: [new Date()],
      parent1Ssn: [],
      parent2Ssn: [],
      socialSecurityNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(this.SSN_PATTERN),
          franceSocialSecurityValidator("gender", "birthDate"),
        ],
      ],
      reason: ["", [requiredSelectionValidator(), Validators.required]],
      isCoveredByOtherMutual: [0, Validators.required],
      teletransmission: [0, Validators.required],
      attachments: [null, [requiredFileValidator()]],
    });
    this.setupFormListeners();
  }

  initializeData() {
    this.stepFacade
      .getTypeDocumentAsync(this.typeDocument)
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          res.forEach((item: any) => {
            if (!item.pieces || item.typeDocument === "Etat Civil") {
              item.pieces = this.getPiecesForTypeDocument(
                item.typeDocument,
                item.id
              );
            }
          });

          this.reasonList.set(res);
        }
      });
  }

  /**
   * Retourne les pièces associées à un type de document spécifique.
   */
  private getPiecesForTypeDocument(
    typeDocument: string,
    idDocCorrespondance: number
  ): any[] {
    const piecesMap: { [key: string]: any[] } = {
      PACS: [
        { id: 1, idDocCorrespondance, piece: "PACS :" },
        {
          id: 2,
          idDocCorrespondance,
          piece:
            "Pacte Civil de Solidarité ou attestation d'inscription au registre du greffe du Tribunal d'Instance",
        },
        {
          id: 3,
          idDocCorrespondance,
          piece: "Attestation de Sécurité sociale",
        },
      ],
      "Vie Maritale": [
        { id: 4, idDocCorrespondance, piece: "Vie Maritale (Cohabitation) :" },
        {
          id: 5,
          idDocCorrespondance,
          piece:
            "Justificatif de vie commune aux deux noms : exemples factures communes (eau, électricité, gaz, internet, téléphone) ou Contrat de bail ou de location, etc.",
        },
        {
          id: 6,
          idDocCorrespondance,
          piece: "Déclaration/Attestation sur l'honneur de vie commune",
        },
      ],
      "Etat Civil": [
        { id: 7, idDocCorrespondance, piece: "État Civil :" },
        {
          id: 8,
          idDocCorrespondance,
          piece: "Copie Acte de naissance ou copie livret de famille",
        },
      ],
      Teletransmission: [
        {
          id: 9,
          idDocCorrespondance,
          piece: "Statut de la Télétransmission :",
        },
        {
          id: 10,
          idDocCorrespondance,
          piece: "Attestation de Sécurité sociale",
        },
      ],
    };

    return piecesMap[typeDocument] || [];
  }

  private patchFormWithBeneficiary(beneficiary: any): void {
    this.beneficiaryForm.patchValue({
      gender: beneficiary.genre == IpecaGenre.Male ? 1 : 0,
      lastName: beneficiary.nom || "",
      firstName: beneficiary.prenom || "",
      birthDate: new Date(beneficiary.dateNaissance),
      familyRelationShip: beneficiary.rang.label || "",
      socialSecurityNumber: beneficiary.numeroSecuriteSociale || "",
      isCoveredByOtherMutual: beneficiary.isCoveredByOtherMutual ? 1 : 0,
      teletransmission: beneficiary.statutTeletransmission ? 1 : 0,
      parent1Ssn: beneficiary.numeroSecuriteSociale || "",
      parent2Ssn: beneficiary.parent2Ssn || "",
    });
    this.beneficiaryForm.markAllAsTouched();
    this.beneficiaryForm.get("reason")?.markAsUntouched();
    this.beneficiaryForm.updateValueAndValidity();
    this.disableSomeInputsByDefault();
  }

  private setupFormListeners(): void {
    this.beneficiaryForm.get("birthDate")?.valueChanges.subscribe(value => {
      this.isAdult.set(checkAge(value, this.MAJOR_AGE));
      this.checkAgeDependentFields(this.beneficiaryForm);
      this.beneficiaryForm
        .get("socialSecurityNumber")
        ?.updateValueAndValidity();
    });
    this.beneficiaryForm.get("gender")?.valueChanges.subscribe(() => {
      this.beneficiaryForm.updateValueAndValidity();
      this.beneficiaryForm
        .get("socialSecurityNumber")
        ?.updateValueAndValidity();
    });
  }

  private loadConnectedUser(): void {
    this.authService
      .getCurrentParticipant()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: connectedUser => {
          this.connectedUser.set(connectedUser);
          this.loadBeneficiaries(connectedUser.numeroParticipant);
        },
        error: err => {
          console.error("Erreur récupération utilisateur connecté :", err);
        },
      });
  }

  private loadBeneficiaries(numeroParticipant: string): void {
    const beneficiaryRequest = new BeneficiaryRequest();
    beneficiaryRequest.numParticipant = numeroParticipant;

    this.beneficiaryService
      .getAllBeneficiaries(beneficiaryRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((response: any) => response || []),
        tap((beneficiaries: any) => {
          const foundBeneficiary = beneficiaries.find(
            (b: any) => b.id === this.beneficiaryId()
          );

          if (foundBeneficiary) {
            this.currentBeneficiary.set(foundBeneficiary);
            this.patchFormWithBeneficiary(foundBeneficiary);
          } else {
            console.warn(
              "Aucun bénéficiaire trouvé avec ID:",
              this.beneficiaryId()
            );
            this.currentBeneficiary.set(null); // Réinitialiser si non trouvé
          }
        })
      )
      .subscribe({
        next: () => {},
        error: err => {
          this.currentBeneficiary.set(null); // Réinitialiser en cas d'erreur
        },
      });
  }

  getErrorMessage(controlName: string): string {
    const control = this.beneficiaryForm.get(controlName);

    if (!control || !control.errors || !control.touched) return "";

    if (control.hasError("required")) {
      return controlName === "reason"
        ? "Vous devez sélectionner un motif valide"
        : "Ce champ est obligatoire";
    }

    if (control.hasError("franceSSN")) {
      return control.errors["franceSSN"].message;
    }

    if (control.hasError("pattern")) {
      return "Format invalide";
    }

    if (control.hasError("nonConform")) {
      return "Le n° de Sécurité sociale saisi ne correspond pas au genre indiqué ou à la date de naissance indiquée.";
    }

    if (control.hasError("maxlength")) {
      return "Nombre de caractère maximal atteint";
    }
    return "Valeur invalide";
  }

  onFilesChanged(files: File[]): void {
    console.log("file changed", files);
    this.beneficiaryForm.patchValue({
      attachments: files,
    });
  }

  onReasonSelected(reason: any) {
    this.currentReason.set(reason.value);
    this.infoBannerTitle.set(this.currentReason().pieces[0].piece);
    const requiredDocs = this.currentReason()
      .pieces.slice(1)
      .map((piece: any) => piece.piece);
    this.requiredDocuments.set(requiredDocs);
    this.setFormFieldAccessByReason();
  }

  private disableSomeInputsByDefault() {
    this.beneficiaryForm.get("gender")?.disable();
    this.beneficiaryForm.get("lastName")?.disable();
    this.beneficiaryForm.get("firstName")?.disable();
    this.beneficiaryForm.get("birthDate")?.disable();
    this.beneficiaryForm.get("socialSecurityNumber")?.disable();
    this.beneficiaryForm.get("teletransmission")?.disable();
    this.isBtnTeletransmissionEnabled = false;
  }
  private enableSomeInputsByDefault() {
    this.beneficiaryForm.get("gender")?.enable();
    this.beneficiaryForm.get("lastName")?.enable();
    this.beneficiaryForm.get("firstName")?.enable();
    this.beneficiaryForm.get("birthDate")?.enable();
    this.beneficiaryForm.get("socialSecurityNumber")?.enable();
    this.beneficiaryForm.get("teletransmission")?.enable();
  }

  private setFormFieldAccessByReason(): void {
    this.disableSomeInputsByDefault();
    const reason = this.currentReason().typeDocument;

    switch (reason) {
      case "Mariage":
      case "Vie Maritale":
        this.beneficiaryForm.get("lastName")?.enable();
        break;

      case "Etat Civil":
        this.beneficiaryForm.get("gender")?.enable();
        this.beneficiaryForm.get("lastName")?.enable();
        this.beneficiaryForm.get("firstName")?.enable();
        this.beneficiaryForm.get("birthDate")?.enable();
        this.beneficiaryForm.get("socialSecurityNumber")?.enable();
        break;

      case "Teletransmission":
        this.beneficiaryForm.get("teletransmission")?.enable();
        this.isBtnTeletransmissionEnabled = true;
        break;

      case "PACS":
      default:
        // Tout reste désactivé
        break;
    }
  }

  OnCoverMutualChange(reason: any) {
    this.showTeletransmission = !reason.value;
  }
  onTeleTransmissionChange() {
    this.showTeletransmission = !this.showTeletransmission;
  }

  checkAgeDependentFields: ValidatorFn = (form: AbstractControl) => {
    const birthDateCtrl = form.get("birthDate");
    const ssnCtrl = form.get("socialSecurityNumber");
    const birthRankCtrl = form.get("birthRank");
    const parent1SsnCtrl = form.get("parent1Ssn");
    const parent2SsnCtrl = form.get("parent2Ssn");

    if (!birthDateCtrl) return null;

    const isUnder18 = !this.isAdult();

    // Mise à jour des validateurs dynamiquement
    if (isUnder18) {
      ssnCtrl?.clearValidators();
      birthRankCtrl?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(11),
      ]);
      parent1SsnCtrl?.setValidators([
        Validators.required,
        Validators.pattern(this.SSN_PATTERN),
      ]);
      parent2SsnCtrl?.setValidators([Validators.pattern(this.SSN_PATTERN)]);
    } else {
      ssnCtrl?.setValidators([
        Validators.required,
        Validators.pattern(this.SSN_PATTERN),
        franceSocialSecurityValidator("gender", "birthDate"),
      ]);
      birthRankCtrl?.clearValidators();
      parent1SsnCtrl?.clearValidators();
      parent2SsnCtrl?.clearValidators();
    }

    ssnCtrl?.updateValueAndValidity();
    birthRankCtrl?.updateValueAndValidity();
    parent1SsnCtrl?.updateValueAndValidity();
    parent2SsnCtrl?.updateValueAndValidity();

    return null;
  };

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

  private generateHtmlBodyFromPayload(formvalue: any): string {
    const formatDate = (dateStr?: string): string => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const teletransmissionStatut = formvalue.IsTeletransmissionEnabled
      ? "Activé"
      : "Non activé";
    const isCoveredMutual = formvalue.IsCoveredMutual ? "Oui" : "Non";

    const user = this.connectedUser();
    const beneficiary = this.currentBeneficiary();

    return `
      Gestion des Bénéficiaires Portail
      <br/>---------------------------------------------------------------------------------------------------------------
      <br/>Données Participant :
      <br/>Type client : « Participant »
      <br/>Nom : ${user.nom}
      <br/>Prénom : ${user.prenom}
      <br/>Date de naissance : ${this.datePipe.transform(
        user.dateNaissance,
        "dd/MM/yyyy"
      )}
      <br/>No_client_01 : ${user.numeroParticipant}
      <br/>Adresse email : ${user.email}
      <br/>---------------------------------------------------------------------------------------------------------------
      <br/>Données Bénéficiaire :
      <br/>Action : ${beneficiary.email}
      <br/>Motif : ${formvalue.reason.objet}
      <br/>Date de rattachement : ${formatDate(formvalue.updateDate)}
      <br/>Nom du Bénéficiaire : ${beneficiary.nom}
      <br/>Prénom du Bénéficiaire : ${beneficiary.prenom}
      <br/>Genre du Bénéficiaire : ${
        formvalue?.gender === "Male" ? "Masculin" : "Féminin"
      }
      <br/>NIR du bénéficiaire : ${formvalue.socialSecurityNumber}
      <br/>Date Naissance Bénéficiaire : ${formatDate(formvalue.birthDate)}
      <br/>Statut télétransmission : ${teletransmissionStatut}
      <br/>Première mutuelle : ${isCoveredMutual}
    `;
  }

  onSubmit(): void {
    this.beneficiaryForm.markAllAsTouched();
    if (this.beneficiaryForm.invalid) {
      this.formScroll.scrollToFirstInvalidControl();
      if (this.beneficiaryForm.get("attachments")?.invalid) {
        this.toast.danger("Erreur", "Veuillez ajouter un document valide");
      }
      return;
    }
    if (this.beneficiaryForm.valid) {
      const modalData = {
        title: "Modifier un bénéficiaire",
        message: ` Êtes-vous sûr(e) de vouloir modifier ce bénéficiaire ?`,
        confirmText: "Oui",
        cancelText: "Non",
        confirmColor: "warn",
      };
      this.modalService
        .openConfirmationModal(modalData)
        .subscribe(confirmed => {
          if (confirmed) this.validationConfirmed();
        });
    } else {
      this.formScroll.scrollToFirstInvalidControl();

      Object.keys(this.beneficiaryForm.controls)
        .filter(key => this.beneficiaryForm.get(key)?.invalid)
        .map(key => ({
          champ: key,
          erreurs: this.beneficiaryForm.get(key)?.errors,
          valeur: this.beneficiaryForm.get(key)?.value,
        }));
    }
  }

  private validationConfirmed() {
    this.enableSomeInputsByDefault();
    console.log(this.beneficiaryForm?.get("reason")?.value);
    const htmlBody = this.generateHtmlBodyFromPayload(
      this.beneficiaryForm.value
    );
    const files = this.beneficiaryFacade.getFiles(this.sectionName);
    const payloadData = this.createPayloadToEmail(
      this.beneficiaryForm?.get("reason")?.value,
      htmlBody,
      files
    );
    console.log("pauload data", payloadData);

    this.documentFacade.saveDocument(payloadData).subscribe({
      next: response => {
        this.beneficiaryFacade.clearFiles(this.sectionName);
        this.toast.success(
          "Modifier un bénéficiaire",
          "Votre demande a bien été prise en compte et sera traitée dans les plus brefs délais par nos services. IMPORTANT: si votre conjoint(e) a son propre contrat IPECA, nous l’invitons à effectuer la même démarche depuis son espace."
        );
      },
      error: err => {
        this.toast.danger(
          "Oops",
          "Erreur lors la modification. Veuillez réessayer plus tard"
        );
      },
    });
  }
}
