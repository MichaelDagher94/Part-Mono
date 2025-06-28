import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { WidgetShortcutComponent } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/widgets/widget-shortcut/widget-shortcut.component";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { BehaviorSubject } from "rxjs";
import { MyDocumentsFacadeService } from "../../../profile/facade/my-documents-facade.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { Router } from "@angular/router";
import { FileDownloadService } from "../../../../../../../../shared-library/src/lib/services/download/file-download.service";
import { BeneficiaryFacadeService } from "../../../beneficiairies/facades/beneficiary-facade.service";
import { GuaranteeFacadeService } from "../../../guarantees/facade/guarantee-facade.service";
import { map } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-db-shortcut",
  imports: [
    MatIconModule,
    WidgetShortcutComponent,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./db-shortcut.component.html",
  styleUrl: "./db-shortcut.component.scss",
})
export class DbShortcutComponent {
  isHealth = false;
  isForesight = false;
  noticeList$ = new BehaviorSubject<any[]>([]);

  guaranteeFacede = inject(GuaranteeFacadeService);
  beneficiaryFacade = inject(BeneficiaryFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  mydocumentFacadeService = inject(MyDocumentsFacadeService);
  downloadService = inject(FileDownloadService);
  toast = inject(ToastMessageService);
  router = inject(Router);
  currentParticipant$ = new BehaviorSubject<any>(null);

  constructor() {
    this.participantFacade.getCurrentParticipant().subscribe(participant => {
      this.currentParticipant$.next(participant);
      if (participant) {
        this.isHealth = participant.couvertureSante;
        this.isForesight =
          participant.couvertureArretTravail === true ||
          participant.couvertureDeces === true;
      }
    });
  }

  loadNotices(participantId: string) {
    this.guaranteeFacede
      .getAllNotices(participantId)
      .pipe(
        map((notices: any) => {
          if (!notices || !Array.isArray(notices)) {
            return [];
          }
          // Regrouper par risque ("Santé", "Prévoyance", etc.)
          const groupedByRisque: { [key: string]: any[] } = notices.reduce(
            (grouped: { [key: string]: any[] }, notice: any) => {
              const risque = notice.risque || "Autre";
              if (!grouped[risque]) {
                grouped[risque] = [];
              }
              grouped[risque].push(notice);
              return grouped;
            },
            {}
          );
          // Transformer en tableau pour l'affichage
          return Object.entries(groupedByRisque).map(
            ([risque, items]: [string, any[]]) => ({
              risque,
              items,
            })
          );
        })
      )
      .subscribe(result => {
        this.noticeList$.next(result.reverse());
      });
  }

  guaranteeLinks = "/mes-garanties";

  ngOnInit() {
    // Par exemple si tu as un BehaviorSubject pour le participant :
    this.currentParticipant$.subscribe(participant => {
      if (participant?.id) {
        this.loadNotices(participant.id);
      }
    });
  }

  /**
   * health
   */

  /**
   * Navigate to health guarantees page
   */
  goToTiersPayant() {
    this.router.navigate(["/mes-cartes-tp"]);
  }

  /**
   * Download the health affiliation certificate
   * This method fetches the participant's affiliation certificate and triggers a download.
   */
  downloadAffiliationCertificate() {
    console.log("Downloading 'Mon attestation d'affiliation'...");
    this.participantFacade
      .downloadCertificate(this.currentParticipant$.value.numeroParticipant)
      .subscribe({
        next: response => {
          console.log("Affiliation certificate response:", response);
          if (response) {
            this.downloadDocument(response);
          }
        },
        error: error => {
          console.error("Error downloading carte de tiers payant", error);
          this.toast.danger("Erreur", "Erreur lors du téléchargement");
        },
      });
  }

  /**
   * Download the health situation report
   * This method fetches the participant's situation report and triggers a download.
   */
  downloadDesignationBeneficiary() {
    this.beneficiaryFacade
      .downloadForesightBeneficiaryDesignationFile(
        this.currentParticipant$.value
      )
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.downloadDocument(response);
          }
        },
        error: error => {
          this.toast.danger(
            "Erreur",
            "Erreur lors du téléchargement du fichier " + error
          );
        },
      });
  }

  downloadDeathOptionChoiceFile() {
    console.log("Downloading 'Death Option Choice File'...");
    this.beneficiaryFacade
      .downloadDeathOptionChoiceFile(this.currentParticipant$.value)
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.downloadDocument(response);
          }
        },
        error: error => {
          this.toast.danger(
            "Erreur",
            "Erreur lors du téléchargement du fichier " + error
          );
        },
      });
  }

  downloadNotice(event: any) {
    this.guaranteeFacede
      .getNoticeFile(event.referencePdf, this.currentParticipant$.value)
      .subscribe({
        next: (response: any) => {
          if (response.data) {
            this.downloadDocument(response.data);
          }
        },
        error: (error: any) => {
          this.toast.danger(
            "Erreur",
            "Erreur lors du téléchargement du fichier"
          );
        },
      });
  }

  private downloadDocument(document: any) {
    try {
      this.downloadService.downloadPdf(document.pdf, document.nom);
    } catch (error) {
      console.error("Error downloading document", error);
      this.toast.danger("Erreur", "Erreur lors du téléchargement du document");
    }
  }
}
