import { Component, effect, inject } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { GuaranteeFacadeService } from "../../facade/guarantee-facade.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { map, switchMap, forkJoin } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FileDownloadService } from "../../../../../../../../shared-library/src/lib/services/download/file-download.service";

@Component({
  selector: "app-guarantees-complete-cover-health",
  imports: [MatExpansionModule, MatButtonModule, MatIconModule],
  templateUrl: "./guarantees-complete-cover-health.component.html",
  styleUrl: "./guarantees-complete-cover-health.component.scss",
})
export class GuaranteesCompleteCoverHealthComponent {
  guaranteeFacade = inject(GuaranteeFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  toast = inject(ToastMessageService);
  downloadService = inject(FileDownloadService);

  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant(),
    { initialValue: null }
  );

  customDocsList = toSignal(
    this.guaranteeFacade
      .getAllCustomDocs({
        NumAdherent: this.currentParticipant().codeAdherent,
        NumEtablissement: this.currentParticipant().codeEtablissement,
        Age: this.currentParticipant().ageActuel + "",
        Population: this.currentParticipant().population,
      })
      .pipe(
        map((offers: any) => {
          offers = offers.data;
          if (!offers) return [];

          // Appel des fonctions externes pour grouper et transformer les données
          const offresGrouped = this.groupOffersByLibelle(offers);
          return offresGrouped;
        }),
        switchMap((offresGrouped: any) => {
          return this.transformGroupedOffersToPdfs(offresGrouped);
        })
      ),
    { initialValue: null }
  );

  expansionItems = [
    {
      title: "Hospi",
      subtitle: "(contrat collectif à adhésion TEST)",
      description: "",
      content: "",
    },
    {
      title: "DECES accidentel ",
      subtitle: "(contrat collectif à adhésion test) ",
      description: "",
      content: "",
    },
  ];

  constructor() {
    effect(() => {
      console.log("docs", this.customDocsList());
    });
  }

  /**
   * Fonction pour grouper les offres par libellé où Risque === 1
   */
  private groupOffersByLibelle(offers: any[]): any {
    return offers
      .filter((x: any) => x.risque === 1)
      .reduce((groups: any, offer: any) => {
        (groups[offer.libelle] = groups[offer.libelle] || []).push(offer);
        return groups;
      }, {});
  }

  /**
   * Fonction pour transformer les groupes en tableau avec PDFs
   */
  private transformGroupedOffersToPdfs(offresGrouped: any) {
    const groupRequests = Object.keys(offresGrouped).map(groupKey => {
      const group = offresGrouped[groupKey];
      const offerRequests = group.map((offer: any) =>
        this.guaranteeFacade.getListPdfs(offer.id).pipe(
          map((pdfs: any) => ({
            Offer: offer,
            Pdfs: pdfs.data,
          }))
        )
      );
      return forkJoin(offerRequests);
    });

    // Attendre que tous les appels API soient terminés
    return forkJoin(groupRequests).pipe(
      map((groupedResults: any[]) => groupedResults.flat())
    );
  }

  download(item: any) {
    this.guaranteeFacade
      .getNoticeFile(item, this.currentParticipant())
      .subscribe({
        next: next => {
          if (next.data.message != "Ok") {
            this.toast.danger("Erreur", next.errorMessage);
            return;
          }
          this.downloadService.downloadPdf(next.data.pdf, next.data.nom);
        },
        error: err => {
          console.warn(err);
          this.toast.danger(
            "Erreur",
            "Une erreur est survenue lors du téléchargement. Veuillez réessayer ulterieurement"
          );
        },
      });
  }
}
