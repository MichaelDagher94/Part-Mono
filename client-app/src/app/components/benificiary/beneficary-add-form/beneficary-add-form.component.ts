import { CommonModule, registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {
  Component,
  EventEmitter,
  inject,
  input,
  LOCALE_ID,
  Output,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
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
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { catchError, map, of, startWith } from "rxjs";
import { CustomDateAdapter } from "../../../../../../shared-library/src/lib/adapters/custom-date-adapters";
import { AutofocusDirective } from "../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";
import { DateInputMaskDirective } from "../../../../../../shared-library/src/lib/directive/mask-date.directive";
import { ModalService } from "../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FormScrollService } from "../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { franceSocialSecurityValidator } from "../../../../../../shared-library/src/lib/validators/FrenchSocialValidators/french-social-ssn.validators";
import { requiredFileValidator } from "../../../../../../shared-library/src/lib/validators/required-file/required-file.validator";
import { BeneficiaryFacadeService } from "../../../features/user-space/beneficiairies/facades/beneficiary-facade.service";
import { BeneficiaryCguComponent } from "../beneficiary-cgu/beneficiary-cgu.component";
import { BeneficiaryInfoBannerComponent } from "../beneficiary-info-banner/beneficiary-info-banner.component";
import { IpecaFileUploadComponent } from "../ipeca-file-upload/ipeca-file-upload.component";
import { checkAge } from "./services/beneficiary-add-form.service";
import { STATE } from "./state/beneficiary.state";
import { DOCUMENT_REQUIREMENTS } from "./state/document-requirement.state";
import { requiredSelectionValidator } from "./validators/beneficiary.validatior";
import { MY_DATE_FORMATS } from "../../../../../../shared-library/src/lib/models/date/custom-date-format";

enum Motive {
  MARRIAGE = "Mariage",
  CIVIL_PARTNERSHIP = "PACS",
  MARITAL_LIFE = "Vie Maritale",
  BIRTH = "Naissance",
  DEPENDENT_PARENT = "Ascendant(e)",
  TAX_DEPENDENT_CHILD = "Enfant à charge fiscale",
}

registerLocaleData(localeFr);

@Component({
  selector: "app-beneficary-add-form",
  providers: [
    provideNgxMask(),
    // provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: LOCALE_ID, useValue: "fr-FR" },
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  imports: [
    FormsModule,
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
    BeneficiaryInfoBannerComponent,
    DateInputMaskDirective,
    AutofocusDirective,
  ],
  templateUrl: "./beneficary-add-form.component.html",
  styleUrl: "./beneficary-add-form.component.scss",
})
export class BeneficaryAddFormComponent {
  sectionName = input.required<string>();

  private formScroll = inject(FormScrollService);
  private modalService = inject(ModalService);

  private beneficiaryFacade = inject(BeneficiaryFacadeService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastMessageService);

  contribution = toSignal(
    this.beneficiaryFacade.getContribution().pipe(
      map(data => {
        ({ data, loading: false, error: null });
      }),
      startWith({ data: null, loading: true, error: null }),
      catchError(error => of({ data: null, loading: false, error }))
    ),
    {
      initialValue: null,
    }
  );
  relationshipSelectList = toSignal(
    this.beneficiaryFacade.getTypeDocumentsModels().pipe(
      map(response =>
        response
          .sort(
            (a: any, b: any) =>
              this.getSortingKey(a.typeDocument) -
              this.getSortingKey(b.typeDocument)
          )
          .map((item: any) => {
            if (!item.pieces) {
              item.pieces = this.getPiecesForTypeDocument(
                item.typeDocument,
                item.id
              );
            }

            return {
              value: item.objet,
              text: item.typeDocument,
              pieces: item.pieces,
            };
          })
      )
    ),
    { initialValue: null }
  );

  showTeletransmission: boolean = true;
  beneficiaryForm!: FormGroup;
  genders = STATE.genders;
  motives = Object.entries(Motive).map(([key, value]) => ({
    id: key,
    label: value,
  }));
  documentRequirements = DOCUMENT_REQUIREMENTS;

  infoBannerTitle = signal("");
  currentReason = signal<any>({});
  requiredDocuments = signal<any[]>([]);
  otherMutualInfo = signal<any[]>([]);

  SSN_PATTERN = STATE.ssnPattern;
  SSN_MASK = STATE.ssnMask;
  DATEMASK = "d0/M0/0000";
  MAJOR_AGE = STATE.majorAge;
  isAdult = signal(true);

  nssInfo = STATE.ssnInfo;
  rattachementInfo = STATE.rattachementSSInfo;
  motiveInfo = STATE.motiveInfo;
  teletransmissionInfo = STATE.teletransmissionInfo;
  birthRank = STATE.birthRange;
  OtherMutualBannerMsg = STATE.OtherMutualBannerMsg;

  maxLengthName = 30;
  maxLengthfirstName = 15;

  birthDateMasked: string = "";
  @Output() onFormValid: EventEmitter<any> = new EventEmitter();

  constructor() {}

  private getSortingKey(typeDocument: string): number {
    typeDocument = typeDocument.toLowerCase();

    if (typeDocument.includes("mariage")) return 1;
    if (typeDocument.includes("pacs")) return 2;
    if (typeDocument.includes("vie maritale")) return 3;
    if (typeDocument.includes("naissance") || typeDocument.includes("adoption"))
      return 4;
    if (typeDocument.includes("enfant handicapé")) return 6;
    if (typeDocument.includes("enfant")) return 5;
    if (typeDocument.includes("ascendant")) return 7;

    return Number.MAX_SAFE_INTEGER;
  }

  ngOnInit(): void {
    this.beneficiaryForm = this.fb.group({
      gender: [this.genders[0], Validators.required],
      lastName: ["", [Validators.required, Validators.maxLength(30)]],
      firstName: ["", [Validators.required, Validators.maxLength(15)]],
      birthDate: ["", [Validators.required]],
      birthRank: [this.birthRank[0]],
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
      isCoveredByOtherMutual: [null, Validators.required],
      teletransmission: [null, Validators.required],
      attachments: [null, [requiredFileValidator()]],
    });

    this.beneficiaryForm.get("birthDate")?.valueChanges.subscribe(value => {
      this.isAdult.set(checkAge(value, this.MAJOR_AGE));
      this.checkAgeDependentFields(this.beneficiaryForm);
    });
    this.beneficiaryForm
      .get("isCoveredByOtherMutual")
      ?.valueChanges.subscribe(value => {
        this.otherMutualInfo.set(value ? [this.OtherMutualBannerMsg] : []);
      });
    this.beneficiaryForm.get("gender")?.valueChanges.subscribe(() => {
      this.beneficiaryForm
        .get("socialSecurityNumber")
        ?.updateValueAndValidity();
    });

    this.beneficiaryForm.get("birthDate")?.valueChanges.subscribe(() => {
      this.beneficiaryForm
        .get("socialSecurityNumber")
        ?.updateValueAndValidity();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.beneficiaryForm.get(controlName);

    if (!control || !control.errors || !control.touched) return "";

    if (control.hasError("franceSSN")) {
      return control.errors["franceSSN"].message;
    }

    if (control.hasError("required")) {
      return controlName === "reason"
        ? "Vous devez sélectionner un motif valide"
        : "Ce champ est obligatoire";
    }
    if (control.hasError("pattern")) {
      return "Veuillez saisir un numéro de sécurité sociale valide";
    }

    if (control.hasError("maxlength")) {
      return "Nombre de caractère maximal atteint";
    }

    return "Valeur invalide";
  }

  // Méthode pour recevoir les fichiers du composant d'upload
  onFilesChanged(files: File[]): void {
    console.log("file changed", files);
    this.beneficiaryForm.patchValue({
      attachments: files,
    });
  }
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
      "État Civil": [
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
      Mariage: [
        {
          id: 13,
          idDocCorrespondance,
          piece: "Mariage :",
        },
        {
          id: 11,
          idDocCorrespondance,
          piece: "Pacte Civil de Solidarité ou attestation ...",
        },
        {
          id: 12,
          idDocCorrespondance,
          piece: "Attestation de Sécurité sociale",
        },
      ],
      Adoption: [
        {
          id: 13,
          idDocCorrespondance,
          piece: "Adoption :",
        },
        {
          id: 11,
          idDocCorrespondance,
          piece: "Certificat d'adoption",
        },
        {
          id: 12,
          idDocCorrespondance,
          piece:
            "Attestation de Sécurité sociale de l’enfant, du salarié ou de son conjoint/concubin, justifiant de la qualité d’ayant droit de l’enfant",
        },
      ],
      "Ajout d'un enfant handicapé": [
        {
          id: 13,
          idDocCorrespondance,
          piece: "Enfant handicapé :",
        },
        {
          id: 11,
          idDocCorrespondance,
          piece:
            "Attestation de Sécurité sociale de l’enfant, du salarié ou de son conjoint/concubin, justifiant de la qualité d’ayant droit de l’enfant",
        },
        {
          id: 12,
          idDocCorrespondance,
          piece:
            "Notification de versement de l’Allocation d’Education de l’Enfant Handicapé (AEEH) ou de l’Allocation Adulte Handicapé (AAH)",
        },
        {
          id: 12,
          idDocCorrespondance,
          piece: "Photocopie de l’avis d’imposition",
        },
      ],
      "Ascendant(e)": [
        {
          id: 13,
          idDocCorrespondance,
          piece: "Enfant handicapé :",
        },
        {
          id: 11,
          idDocCorrespondance,
          piece: "Photocopie du livret de famille du participant*",
        },
        {
          id: 12,
          idDocCorrespondance,
          piece:
            "Photocopie de l’avis d’imposition du participant où figure le nom de l’ascendant ou attestation de droits à la Complémentaire santé solidaire.",
        },
        {
          id: 12,
          idDocCorrespondance,
          piece:
            "*En cas de rattachement récent au foyer fiscal et si l’ascendant ne figure pas sur le dernier avis d’imposition, il est demandé au participant de transmettre un justificatif émanant des impôts prouvant le rattachement récent.",
        },
      ],
    };

    return piecesMap[typeDocument] || [];
  }

  onReasonSelected(reason: any) {
    console.log(reason);
    this.currentReason.set(reason);
    this.infoBannerTitle.set(reason.text);
    // const documents = this.documentRequirements[reason] || [];
    const requiredDocs = this.currentReason()
      .pieces.slice(1)
      .map((piece: any) => piece.piece);
    this.requiredDocuments.set(requiredDocs);
  }

  OnCoverMutualChange(reason: any) {
    this.showTeletransmission = !reason.value;
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

  onSubmit(): void {
    this.beneficiaryForm.markAllAsTouched();
    if (this.beneficiaryForm.valid) {
      console.log(this.beneficiaryForm.value);
      const modalData = {
        title: "Ajouter un bénéficiaire",
        message: `Etes vous sûr de vouloir ajouter cette personne parmi vos bénéficiaires ?`,
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
      const attachmentsCtrl = this.beneficiaryForm.get("attachments");
      if (attachmentsCtrl?.errors?.["requiredFile"]) {
        this.toast.info("Attention", "Les pièces jointes sont obligatoires");
      }
      this.formScroll.scrollToFirstInvalidControl();
    }
  }

  private validationConfirmed() {
    this.onFormValid.emit(this.beneficiaryForm.value);
  }
}
