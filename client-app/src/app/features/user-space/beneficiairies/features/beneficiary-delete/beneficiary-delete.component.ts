import { CommonModule } from "@angular/common";
import {
  Component,
  DestroyRef,
  effect,
  inject,
  LOCALE_ID,
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
import { map, tap } from "rxjs";
import { CustomDateAdapter } from "../../../../../../../../shared-library/src/lib/adapters/custom-date-adapters";
import { DateInputMaskDirective } from "../../../../../../../../shared-library/src/lib/directive/mask-date.directive";
import { EnuCorrespondance } from "../../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { BeneficiaryRequest } from "../../../../../../../../shared-library/src/lib/models/beneficiary/request/BeneficiaryRequest";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { AuthenticationService } from "../../../../../../../../shared-library/src/lib/services/authentication/authentication.service";
import { BeneficiaryService } from "../../../../../../../../shared-library/src/lib/services/beneficiary/beneficiary.service";
import { FormScrollService } from "../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { requiredFileValidator } from "../../../../../../../../shared-library/src/lib/validators/required-file/required-file.validator";
import { checkAge } from "../../../../../components/benificiary/beneficary-add-form/services/beneficiary-add-form.service";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { BeneficiaryInfoBannerComponent } from "../../../../../components/benificiary/beneficiary-info-banner/beneficiary-info-banner.component";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";

import { BeneficiaryFacadeService } from "../../facades/beneficiary-facade.service";
import { BeneficiaryDeleteFacadeService } from "./facade/beneficiary-delete.facade.service";
import {
  DELETE_STATE,
  Gender,
  SSN_PATTERN,
} from "./state/beneficiary-delete.state";
import { notFutureDateValidator } from "./validator/date.validator";
import { MY_DATE_FORMATS } from "../../../../../../../../shared-library/src/lib/models/date/custom-date-format";

@Component({
  selector: "app-beneficiary-delete",
  providers: [
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
    BeneficiaryInfoBannerComponent,
    DateInputMaskDirective,
  ],
  templateUrl: "./beneficiary-delete.component.html",
  styleUrl: "./beneficiary-delete.component.scss",
})
export class BeneficiaryDeleteComponent {
  // dependencies
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly beneficiaryService = inject(BeneficiaryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthenticationService);
  private deleteFacadeService = inject(BeneficiaryDeleteFacadeService);
  private toast = inject(ToastMessageService);
  private modalService = inject(ModalService);
  private formScroll = inject(FormScrollService);
  private beneficiaryFacade = inject(BeneficiaryFacadeService);

  // declarations
  sectionName = "DeleteBeneficiaryForm";
  beneficiaryForm!: FormGroup;
  SSN_PATTERN = SSN_PATTERN;
  SSN_MASK = DELETE_STATE.SSN_MASK;
  MAJOR_AGE = DELETE_STATE.MAJOR_AGE;
  currentReason = signal<any>(null);
  requiredDocuments = signal<string[]>([]);
  typeDocument = EnuCorrespondance.beneficiaire_Suppression;

  //signals
  connectedUser = signal<any>(null);
  currentBeneficiary = signal<any>(null);
  beneficiaryId = signal<any>(null);
  isAdult = signal(true);
  reasonList = toSignal(
    this.beneficiaryFacade.getTypeDocumentsModels(this.typeDocument)
  );

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initEmptyForm();
    // const id = this.route.snapshot.params["id"];
    const id = history.state.id || null;
    if (!id) {
      this.router.navigate(["mes-beneficiaires"]);
    }
    this.beneficiaryId.set(id);
    if (this.beneficiaryId()) this.loadConnectedUser();
  }

  // methods
  get genderLabels(): Record<Gender, string> {
    return {
      [Gender.MALE]: "Masculin",
      [Gender.FEMALE]: "Féminin",
    };
  }

  get genders(): Gender[] {
    return [Gender.MALE, Gender.FEMALE];
  }

  onReasonSelected(reasonChoice: any): void {
    const reasonCode = reasonChoice.id;
    const reason = DELETE_STATE.EVENT_TYPES.find(r => r.code === reasonCode);

    this.currentReason.set(reasonChoice);
    this.requiredDocuments.set(
      reason ? [...DELETE_STATE.DOCUMENT_REQUIREMENTS[reason.code]] : []
    );
  }

  private initEmptyForm(): void {
    this.beneficiaryForm = this.fb.group({
      gender: [{ value: "", disabled: true }, Validators.required],
      lastName: [{ value: "", disabled: true }, Validators.required],
      firstName: [{ value: "", disabled: true }, Validators.required],
      birthDate: [{ value: "", disabled: true }, [Validators.required]],
      genderHidden: [{ value: "" }, Validators.required],
      lastNameHidden: [{ value: "" }, Validators.required],
      firstNameHidden: [{ value: "" }, Validators.required],
      birthDateHidden: [{ value: "" }, [Validators.required]],
      eventDate: [new Date(), [Validators.required, notFutureDateValidator()]],
      eventType: ["", [Validators.required]],
      familyRelationShip: [],
      updateDate: [new Date()],
      parent1Ssn: [],
      parent2Ssn: [],
      socialSecurityNumber: [
        { value: "", disabled: true },
        [Validators.required, Validators.pattern(this.SSN_PATTERN)],
      ],
      isCoveredByOtherMutual: [0, Validators.required],
      teletransmission: [0, Validators.required],
      attachments: [null, [requiredFileValidator()]],
    });

    // this.setupFormListeners();
  }

  private patchFormWithBeneficiary(beneficiary: any): void {
    this.beneficiaryForm.patchValue({
      gender: beneficiary.genre,
      genderHidden: beneficiary.genre,
      lastName: beneficiary.nom || "",
      lastNameHidden: beneficiary.nom || "",
      firstName: beneficiary.prenom || "",
      firstNameHidden: beneficiary.prenom || "",
      birthDate: new Date(beneficiary.dateNaissance),
      birthDateHidden: new Date(beneficiary.dateNaissance),
      familyRelationShip: beneficiary.rang.label || "",
      socialSecurityNumber: beneficiary.numeroSecuriteSociale || "",
      isCoveredByOtherMutual: beneficiary.isCoveredByOtherMutual ? 1 : 0,
      teletransmission: beneficiary.statutTeletransmission ? 1 : 0,
      parent1Ssn: beneficiary.numeroSecuriteSociale || "",
      parent2Ssn: beneficiary.parent2Ssn || "",
    });
  }

  private setupFormListeners(): void {
    this.beneficiaryForm.get("birthDate")?.valueChanges.subscribe(value => {
      this.isAdult.set(checkAge(value, this.MAJOR_AGE));
      this.checkAgeDependentFields(this.beneficiaryForm);
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
        next: beneficiaries => {},
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

    if (control.hasError("pattern")) {
      return "Format invalide";
    }
    if (control.hasError("futureDate")) {
      return " La date ne peut pas être dans le futur";
    }
    // Ajouter d'autres types d'erreurs au besoin
    return "Valeur invalide";
  }

  onFilesChanged(files: File[]): void {
    console.log("file changed", files);
    this.beneficiaryForm.patchValue({
      attachments: files,
    });
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
      ]);
      birthRankCtrl?.clearValidators();
      parent1SsnCtrl?.clearValidators();
      parent2SsnCtrl?.clearValidators();
    }

    ssnCtrl?.updateValueAndValidity({ emitEvent: false });
    birthRankCtrl?.updateValueAndValidity({ emitEvent: false });
    parent1SsnCtrl?.updateValueAndValidity({ emitEvent: false });
    parent2SsnCtrl?.updateValueAndValidity({ emitEvent: false });

    return null;
  };

  createPayload(typeDocument: any, html: string, files: any) {
    return {
      destination: typeDocument.destination === "GED" ? 0 : 1,
      fromName: typeDocument.email,
      message: "",
      typeDocument: typeDocument.objet,
      participantNumber: this.connectedUser().numeroParticipant,
      lastName: this.connectedUser().nom,
      firstName: this.connectedUser().prenom,
      email: this.connectedUser().email,
      htmlBody: html,
      socialSecurityNumber: this.connectedUser().numeroSecuriteSociale,
      birthDate: new Date(
        this.connectedUser().dateNaissance
      ).toLocaleDateString("fr-FR"),
      vip: this.connectedUser().vip,
      files: files,
    };
  }

  createHtmlBody(formvalue: any) {
    const formatDate = (dateStr?: string): string => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };
    const user = this.connectedUser();
    const reason = this.currentReason();
    const model = formvalue;

    return `
  Gestion des Bénéficiaires Portail
  <br/>---------------------------------------------------------------------------------------------------------------
  <br/>Données Participant :
  <br/>Type client : « Participant »
  <br/>Nom : ${user.nom}
  <br/>Prénom : ${user.prenom}
  <br/>Date de naissance : ${user.dateNaissance}
  <br/>No_client_01 : ${user.numeroParticipant}
  <br/>Adresse email : ${user.email}
  <br/>---------------------------------------------------------------------------------------------------------------
  <br/>Données Bénéficiaire :
  <br/>Action : ${model?.email ?? ""}
  <br/>Motif : ${reason?.objet ?? ""}
  <br/>Date de rattachement : ${formatDate(model.updateDate)}
  <br/>Nom du Bénéficiaire : ${model.lastName}
  <br/>Prénom du Bénéficiaire : ${model.firstName}
  <br/>Genre du Bénéficiaire : ${
    model?.gender === "Male" ? "Masculin" : "Féminin"
  }
  <br/>NIR du bénéficiaire : ${model.socialSecurityNumber}
  <br/>Date Naissance Bénéficiaire : ${formatDate(model.birthDate)}
  <br/>Statut télétransmission : ${
    model.isTeletransmissionEnabled ? "Activé" : "Non activé"
  }
  <br/>Première mutuelle : ${model.isCoveredByOtherMutual ? "Oui" : "Non"}
`;
  }

  onSubmit(): void {
    if (this.beneficiaryForm.invalid) {
      this.formScroll.scrollToFirstInvalidControl();
      if (this.beneficiaryForm.get("attachments")?.invalid) {
        this.toast.danger("Erreur", "Veuillez ajouter un document valide");
      }
      return;
    }
    const prenom = this.beneficiaryForm.value.firstNameHidden;
    const nom = this.beneficiaryForm.value.lastNameHidden;

    const modalData = {
      title: "Liste des bénéficiaires",
      message: `Etes vous sûr de vouloir retirer ${prenom} ${nom} de vos bénéficiaires?`,
      confirmText: "Oui",
      cancelText: "Non",
      confirmColor: "warn",
    };

    this.modalService.openConfirmationModal(modalData).subscribe(confirmed => {
      if (confirmed) this.validationConfirmed();
    });
  }

  private validationConfirmed() {
    const htmlBody = this.createHtmlBody(this.beneficiaryForm.value);
    const files = this.beneficiaryFacade.getFiles(this.sectionName);
    const payloadData = this.createPayload(
      this.currentReason(),
      htmlBody,
      files
    );

    this.beneficiaryFacade.submitDocumentStep(payloadData).subscribe({
      next: response => {
        this.beneficiaryFacade.clearFiles(this.sectionName);
        this.toast.success(
          "Liste des bénéficiaires",
          "Votre demande a bien été prise en compte et sera traitée dans les plus brefs délais par nos services. IMPORTANT: si votre conjoint(e) a son propre contrat IPECA, nous l’invitons à effectuer la même démarche depuis son espace.",
          3000,
          () => location.reload()
        );
      },
      error: err => {
        this.toast.danger(
          "Liste des bénéficiaires",
          "Erreur lors la modification. Veuillez réessayer plus tard"
        );
      },
    });
  }

  private deleteBeneficiary() {
    this.deleteFacadeService
      .submitDeletion(
        this.beneficiaryForm.value,
        this.connectedUser().numeroParticipant,
        this.beneficiaryId()
      )
      .subscribe(success => {
        if (success) {
          this.toast.success(
            "Succès",
            "Votre demande a bien été prise en compte. Elle sera traitée dans les plus brefs délais par nos services de gestion "
          );
          setTimeout(() => {
            this.router.navigate(["/mes-beneficiaires/sante/liste"]);
          }, 5000);
        } else {
          this.toast.danger(
            "Erreur",
            "Une erreur est survenue lors de l’enregistrement de votre demande. Nous vous invitons à la renouveler ultérieurement"
          );
        }
      });
  }
}
