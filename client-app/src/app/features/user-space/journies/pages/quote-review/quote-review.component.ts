import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { ListState } from "../../../../../../../../shared-library/src/lib/models/state/list-state.model";
import { CustomTableComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/custom-table/custom-table.component";
import { SkeletonTableLoaderComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/loader/skeleton-table-loader/skeleton-table-loader.component";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { JourniesFacadeService } from "../../facade/journies-facade.service";

@Component({
  selector: "app-quote-review",
  imports: [CustomTableComponent, SkeletonTableLoaderComponent, CommonModule],
  templateUrl: "./quote-review.component.html",
  styleUrl: "./quote-review.component.scss",
})
export class QuoteReviewComponent {
  loadingState$ = new BehaviorSubject<ListState<any>>({
    loading: false,
    error: null,
    data: [],
  });
  //dependencies
  toast = inject(ToastMessageService);
  stepFacade = inject(JourniesFacadeService);
  participantFacade = inject(ParticipantFacadeService);

  //delcarations
  currentParticipant = signal<any>(null);
  dataToDisplay: any;
  emptyMsg = "Vous n'avez pas de devis sur les 6 derniers mois";

  readonly columns = ["date_Emission", "libelle", "beneficiaire"];
  readonly columnTitles: Record<string, string> = {
    date_Emission: "DATE D'ÉMISSION",
    libelle: "libellé",
    beneficiaire: "bénéficiaire",
    download: "Carte TP",
  };

  ngOnInit(): void {
    console.log("iniit");
    this.participantFacade.getCurrentParticipant().subscribe(participant => {
      this.currentParticipant.set(participant);
      this.initializeData();
    });
  }

  initializeData() {
    this.loadingState$.next({ loading: true, error: null, data: [] });
    this.stepFacade
      .GetParticipantQuotes(this.currentParticipant().numeroParticipant)
      .pipe(
        map(response => {
          const list = response?.[0]?.liste ?? [];
          return list.map((row: any) => ({
            ...row,
            canDownload: this.checkDownload(row),
          }));
        })
      )
      .subscribe({
        next: mappedData => {
          this.loadingState$.next({
            loading: false,
            error: null,
            data: mappedData,
          });
          this.dataToDisplay = mappedData;
        },
        error: err => {
          this.loadingState$.next({ loading: false, error: err, data: [] });
          console.error("Erreur lors du chargement des devis :", err);
          this.dataToDisplay = [];
        },
      });
  }

  private checkDownload(row: any): boolean {
    if (!row || !row.reference_Editique) {
      console.error("Utilisateur non connecté ou données manquantes.");
      row.canDownload = false;
      return false;
    }
    return true;
  }

  handleDownload(row: any): void {
    this.stepFacade.download(row.reference_Editique, "Archive").subscribe({
      next: res => {
        this.stepFacade.downloadBase64Pdf(res?.pdf?.file, res?.nomPDF);
      },
      error: () =>
        this.toast.danger(
          "Oups",
          "Erreur lors du téléchargement. Veuillez réessayer plus tard."
        ),
    });
  }
}
