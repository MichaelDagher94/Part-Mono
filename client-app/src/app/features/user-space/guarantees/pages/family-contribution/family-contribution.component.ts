import { CommonModule, registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {
  Component,
  computed,
  ElementRef,
  inject,
  LOCALE_ID,
  signal,
  ViewChild,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { map } from "rxjs";
import {
  Contrat,
  ContratAction,
  contratResiliation,
  RaisonAdhesionParticipant,
} from "../../../../../../../../shared-library/src/lib/enumerations/v1/Contrat.enum";
import { IpecaContributionChoice } from "../../../../../../../../shared-library/src/lib/enumerations/v1/IpecaContributionChoice";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FormScrollService } from "../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { checkedValidatorRequired } from "../../../../../../../../shared-library/src/lib/validators/checkbox/checkbox-validators";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { GuaranteeFacadeService } from "../../facade/guarantee-facade.service";

registerLocaleData(localeFr);

@Component({
  selector: "app-family-contribution",
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatRadioModule,
    BeneficiaryCguComponent,
    MatCheckboxModule,
  ],
  templateUrl: "./family-contribution.component.html",
  styleUrl: "./family-contribution.component.scss",
  providers: [{ provide: LOCALE_ID, useValue: "fr" }],
  // encapsulation: ViewEncapsulation.None,
})
export class FamilyContributionComponent {
  @ViewChild("descriptionContainer", { static: false })
  descriptionContainer!: ElementRef;
  guaranteeFacade = inject(GuaranteeFacadeService);
  private fb = inject(FormBuilder);

  formScroll = inject(FormScrollService);
  modalService = inject(ModalService);
  toast = inject(ToastMessageService);

  EContratResiliation = contratResiliation;
  ETypeContrat = Contrat;
  EContratAction = ContratAction;
  ERaisonAdhesionParticipant = RaisonAdhesionParticipant;

  currentParticipant = toSignal(this.guaranteeFacade.getCurrentParticipant(), {
    initialValue: null,
  });
  raisonAdhesionParticipantTwoTooltip = `
• Mariage du salarié, signature d’un PACS, vie maritale telle que définie à l’article 515-8 du Code civil (sur présentation d’une attestation sur l’honneur et d’un justificatif de domicile commun)
• Divorce, rupture de PACS, rupture de concubinage
• Changement de situation d’emploi de l’époux, du pacsé, du concubin entraînant changement de couverture
• Décès de l’époux, du pacsé, du concubin
• Décès d’un enfant à charge
• Naissance ou adoption d’un enfant à charge
• Reprise en charge d’un enfant (par exemple en cas de reprise d’étude)
• Départ d’un enfant à charge
• Ascendant rattaché à votre foyer fiscal, figurant sur votre avis d’imposition ou bénéficiaire à titre personnel de la Complémentaire santé solidaire
`;

  adhesionReasonTooltip =
    "La cotisation est appelée sur un mois entier sans proratisation selon la date d’affiliation.";

  dateChoices = this.getNextDateChoices() ?? [];
  contributionChoice = signal<any>(null);
  contribution = toSignal(
    this.guaranteeFacade.getFamilyContributionIntro().pipe(
      map((response: any) => {
        const intro = response.data;

        this.contributionChoice.set(
          IpecaContributionChoice[intro.contratParticipant]
        );
        this.expirationDate.set(
          intro.dateEffet ? new Date(intro.dateEffet) : null
        );
        return response.data;
      })
    ),
    { initialValue: null }
  );
  readonly isDateEffectExpired = computed(() => {
    return this.contribution()?.data?.contratResiliation ?? false;
  });

  expirationDate = signal<Date | null>(null);
  formGroup = this.fb.group({
    choice: [null, Validators.required],
    dateChoiceIsole: [null, Validators.required],
    dateChoiceFamille: [null, Validators.required],
    adhesionReason: [0, [Validators.required, checkedValidatorRequired()]],
  });
  ipecaContributionChoice = IpecaContributionChoice;

  ngOnInit(): void {
    this.initializeForm();
    this.updateLinkHref();
  }

  initializeForm() {
    this.updateValidatorsBasedOnChoice();
  }

  updateValidatorsBasedOnChoice(): void {
    this.formGroup.get("choice")?.valueChanges.subscribe(value => {
      if (value === 0) {
        // Si choice == 0, dateChoiceIsole est required
        this.formGroup
          .get("dateChoiceIsole")
          ?.setValidators(Validators.required);
        this.formGroup.get("dateChoiceFamille")?.clearValidators();
      } else {
        // Sinon, dateChoiceFamille est required
        this.formGroup
          .get("dateChoiceFamille")
          ?.setValidators(Validators.required);
        this.formGroup.get("dateChoiceIsole")?.clearValidators();
      }

      // Met à jour les états des validateurs
      this.formGroup.get("dateChoiceIsole")?.updateValueAndValidity();
      this.formGroup.get("dateChoiceFamille")?.updateValueAndValidity();
    });
  }

  createPayload() {
    return {
      numeroParticipant: this.contribution().data.numParticipant,
      choix: this.formGroup.get("choice")?.value,
      raisonAdhesion: Number(this.formGroup.get("adhesionReason")?.value),
      moisAdhesion: "",
      dateResiliation: this.formGroup.get("choice")?.value
        ? this.formGroup.get("dateChoiceFamille")?.value
        : this.formGroup.get("dateChoiceIsole")?.value,
      isSiteWeb: "",
      platform: "",
      browser: "",
      engine: "",
    };
  }

  getNextDateChoices() {
    const today = new Date();
    return Array.from(
      { length: 3 },
      (_, i) => new Date(today.getFullYear() + 1, today.getMonth() + i + 1, 1)
    );
  }

  updateLinkHref(): void {
    if (this.descriptionContainer && this.descriptionContainer.nativeElement) {
      const container: HTMLElement = this.descriptionContainer.nativeElement;

      // Trouver toutes les balises <a> dans le contenu
      const links = container.querySelectorAll("a");
      links.forEach((link, index) => {
        // Modifier dynamiquement le href pour chaque lien
        if (index === 0) {
          link.setAttribute("href", "/mes-garanties/sante/notice-sante");
        } else if (index === 1) {
          link.setAttribute("href", "/procedure-de-resiliation");
        }

        // Optionnel : Ajouter un target="_blank" pour ouvrir dans un nouvel onglet
        link.setAttribute("target", "_blank");
      });
    }
  }

  download() {}

  redirectTo() {}
  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      this.formScroll.scrollToFirstInvalidControl();
      return;
    }
    this.confirm();
  }

  confirm() {
    const modalData = {
      title: "Couverture famille ",
      message: `Êtes-vous sûr de vouloir confirmer votre choix ?`,
      confirmText: "Oui",
      cancelText: "Non",
      confirmColor: "warn",
    };
    this.modalService.openConfirmationModal(modalData).subscribe(confirmed => {
      if (confirmed) {
        const payload = this.createPayload();
        console.log(payload);
        this.guaranteeFacade.insertAirbusChoice(payload).subscribe({
          next: response => {
            this.handleApiResponse(response);
          },
          error: err => {
            this.toast.danger(
              "Oups",
              "Erreur lors de l'envoi de la demande de prise en charge hospitalière"
            );
            console.error(
              "Erreur lors de l'envoi de la demande de prise en charge hospitalière :",
              err
            );
          },
        });
      }
    });
  }
  private handleApiResponse(response: any): void {
    if (response?.message_Retour?.length > 0) {
      const errorMessages = response.message_Retour.filter(
        (msg: any) => msg.type === "ERR"
      );
      const infoMessages = response.message_Retour.filter(
        (msg: any) => msg.type !== "ERR"
      );
      // Afficher les erreurs
      if (errorMessages.length > 0) {
        errorMessages.forEach((err: any) => {
          this.toast.danger("Erreur", err.message);
        });
      }

      // Afficher les messages d'information
      if (infoMessages.length > 0) {
        infoMessages.forEach((msg: any) => {
          this.toast.info("Information", msg.message);
        });
      }
    } else if (response?.isSuccess) {
      this.toast.success(
        "Succès",
        "La demande d'adhésion a été envoyée avec succès."
      );
    }
  }

  get isResiliation(): boolean {
    return (
      this.contribution()?.contratParticipant == this.ETypeContrat.Isole &&
      this.contribution()?.contratResiliation !=
        this.EContratResiliation.Aucune &&
      this.contribution()?.contratResiliation !=
        this.EContratResiliation.Temporaire
    );
  }

  get resiliationMessage(): string {
    const dateResiliation = this.contribution()?.dateResiliation;
    return dateResiliation
      ? `Votre adhésion au contrat facultatif famille a été résiliée le ${new Date(
          dateResiliation
        ).toLocaleDateString("fr-FR")}.`
      : "Votre adhésion au contrat facultatif famille a été résiliée.";
  }

  get isCurrentFamilyContrat() {
    return (
      this.contribution().contratParticipant == this.ETypeContrat.Famille &&
      this.contribution().contratResiliation != this.EContratResiliation.Futur
    );
  }

  get adhesionCondition() {
    return (
      this.contribution().contratParticipant == this.ETypeContrat.Isole &&
      this.contribution().contratAction == this.EContratAction.Aucune &&
      this.contribution().contratResiliation !=
        this.EContratResiliation.SansDate
    );
  }

  get adhesionReason(): string {
    const reason = this.contribution()?.raisonAdhesion;
    switch (reason) {
      case this.ERaisonAdhesionParticipant.One:
        return " Votre demande d'adhésion sera effective dès validation de notre service de gestion.";
      case this.ERaisonAdhesionParticipant.Three:
      case this.ERaisonAdhesionParticipant.Two:
        return `Votre demande d'adhésion a bien été prise en compte et sera effective le ${new Date(
          this.contribution().dateAdhesion
        ).toLocaleDateString("fr-FR")}`;
      case this.ERaisonAdhesionParticipant.Four:
      case this.ERaisonAdhesionParticipant.Five:
        return ` Votre demande de Ré-adhésion a bien été prise en compte et sera effective le  ${new Date(
          this.contribution().dateAdhesion
        ).toLocaleDateString("fr-FR")}`;
      default:
        return "";
    }
  }

  get isFutureResiliation(): boolean {
    return (
      this.contribution()?.ContratParticipant === this.ETypeContrat.Famille &&
      this.contribution()?.contratResiliation === this.EContratResiliation.Futur
    );
  }

  get isReAdhesion(): boolean {
    return (
      this.contribution()?.contratAction === this.EContratAction.ReAdhesion
    );
  }
  get isAdhesion(): boolean {
    return this.contribution()?.contratAction === this.EContratAction.Adhesion;
  }

  get isAdhesionReAdhesion(): boolean {
    return (
      this.contribution()?.contratAction === this.EContratAction.Adhesion ||
      this.contribution()?.contratAction === this.EContratAction.ReAdhesion
    );
  }
}
