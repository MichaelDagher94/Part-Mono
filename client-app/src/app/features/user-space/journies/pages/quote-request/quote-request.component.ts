import { DatePipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { map, take } from "rxjs";
import { EnuCorrespondance } from "../../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { BannerInformationComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/banner-information/banner-information.component";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { BeneficiaryInfoBannerComponent } from "../../../../../components/benificiary/beneficiary-info-banner/beneficiary-info-banner.component";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { DocumentFacadeService } from "../../facade/document-facade/document-facade.service";
import { JourniesFacadeService } from "../../facade/journies-facade.service";
import { FormScrollService } from "../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { requiredFileValidator } from "../../../../../../../../shared-library/src/lib/validators/required-file/required-file.validator";
import { AutofocusDirective } from "../../../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";

@Component({
  selector: "app-quote-request",
  providers: [DatePipe],
  imports: [
    BeneficiaryCguComponent,
    IpecaFileUploadComponent,
    BannerInformationComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    BeneficiaryInfoBannerComponent,
    AutofocusDirective,
  ],
  templateUrl: "./quote-request.component.html",
  styleUrl: "./quote-request.component.scss",
})
export class QuoteRequestComponent {
  sectionName = "QuoteStepForm";
  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  toast = inject(ToastMessageService);
  participantFacade = inject(ParticipantFacadeService);
  stepFacade = inject(JourniesFacadeService);
  documentFacade = inject(DocumentFacadeService);
  datePipe = inject(DatePipe);
  private formScroll = inject(FormScrollService);

  corresp_sante_demande_devis = EnuCorrespondance.sante_Demande_Devis;
  currentParticipant = signal<any>(null);
  typeDocumentModels = signal<any>(null);
  quoteTypes = signal<any[]>([]);
  selectedQuoteTypes = signal<any>(null);
  bannerUploadFileList = signal<string[]>([]);

  bannerText =
    "Le devis est établi sous réserve de l’ouverture de vos droits au titre de votre contrat complémentaire, et le cas échéant, dans la limite des garanties annuelles disponibles à la date de réalisation de celui-ci.";

  form!: FormGroup;

  readonly quoteTypeOrder = ["Devis Dentaire", "Devis Optique", "Devis Autre"];

  ngOnInit(): void {
    this.form = this.fb.group({
      quoteType: ["", Validators.required],
      isPartnerProvider: [0, Validators.required],
      documents: [null, [requiredFileValidator()]],
      comments: [""],
    });

    this.participantFacade.getCurrentParticipant().subscribe(participant => {
      this.currentParticipant.set(participant);
    });
    this.initializeData();
  }
  initializeData() {
    this.stepFacade
      .getTypeDocumentAsync(this.corresp_sante_demande_devis)
      .pipe(
        take(1),
        map(res => {
          if (!res) return [];
          return [...res].sort(
            (a, b) =>
              this.quoteTypeOrder.indexOf(a.typeDocument) -
              this.quoteTypeOrder.indexOf(b.typeDocument)
          );
        })
      )
      .subscribe(sorted => {
        this.quoteTypes.set(sorted);
      });
  }
  fileToUploadList = [
    {
      id: 6,
      typeDocument: "Devis Dentaire",
      message: "Les frais dentaires, implantologie, orthodontie",
    },
    {
      id: 26,
      typeDocument: "Devis Optique",
      message: "Equipement optique, lentilles, chirurgie réfractive Laser",
    },
    {
      id: 23,
      typeDocument: "Devis Autre",
      message:
        "Les Prothèses auditives, les dépassements d'honoraires suite à une intervention chirurgicale, opération de la cataracte, les semelles orthopédiques",
    },
  ];

  onTypeSelected(row: any) {
    this.selectedQuoteTypes.set(row);
    const selected = this.fileToUploadList.find(item => item.id == row.id);
    this.bannerUploadFileList.set(selected ? [selected.message] : []);
    this.togglePartnerProviderField();
  }

  private togglePartnerProviderField() {
    const isOtherType = this.form.get("quoteType")?.value === "Devis Autre";
    const partnerProviderControl = this.form.get("isPartnerProvider");

    if (isOtherType) {
      partnerProviderControl?.clearValidators();
      partnerProviderControl?.disable();
    } else {
      partnerProviderControl?.setValidators([Validators.required]);
      partnerProviderControl?.enable();
    }
    partnerProviderControl?.updateValueAndValidity();
  }

  isVisiblePartnerProviderField() {
    const isOtherType = this.form.get("quoteType")?.value === "Devis Autre";
    if (isOtherType) return false;
    return true;
  }

  onSubmit() {
    if (this.form.invalid) {
      if (this.form.get("documents")?.invalid) {
        this.toast.danger(
          "Devis",
          "Veuillez nous fournir la ou les pièce(s) justificative(s) demandée(s)"
        );
      }
      this.formScroll.scrollToFirstInvalidControl();
      return;
    }
    if (this.form.valid) {
      const modalData = {
        title: "Devis ",
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
              `<br/>\nProfessionnel de santé partenaire Santéclair ?:\t${
                this.form.get("isPartnerProvider")?.value ? "Oui" : "Non"
              }`;

            const payload = this.createPayload(htmlBody, participantBirthDate);
            this.documentFacade.saveDocument(payload).subscribe(res => {
              this.resetAll();
              this.toast.success(
                "Demande de devis",
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
      destination: this.selectedQuoteTypes().destination === "GED" ? 0 : 1,
      message: this.form.get("comments")?.value,
      fromName: "Formulaire Santé Devis",
      typeDocument: this.selectedQuoteTypes().objet,
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

  onFileSelected(files: File[]) {
    this.form.patchValue({ documents: files });
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
