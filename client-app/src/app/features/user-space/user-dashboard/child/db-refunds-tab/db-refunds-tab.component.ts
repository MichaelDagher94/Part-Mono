import { Component, inject } from "@angular/core";
import { ReimbursementFacadeService } from "../../../../../core/services/reimbursement-facade.service";
import { BehaviorSubject, map } from "rxjs";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { MatTableModule } from "@angular/material/table";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FileDownloadService } from "../../../../../../../../shared-library/src/lib/services/download/file-download.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { ListState } from "../../../../../../../../shared-library/src/lib/models/state/list-state.model";
import { SkeletonTableLoaderComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/loader/skeleton-table-loader/skeleton-table-loader.component";

@Component({
  selector: "app-db-refunds-tab",
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    SkeletonTableLoaderComponent,
  ],
  templateUrl: "./db-refunds-tab.component.html",
  styleUrl: "./db-refunds-tab.component.scss",
})
export class DbRefundsTabComponent {
  refundListState$ = new BehaviorSubject<ListState<any>>({
    loading: false,
    error: null,
    data: [],
  });

  reimbursmentLink = "/mes-remboursements";
  reimbursmentTitle = "MES DERNIERS REMBOURSEMENTS";
  reimbursmentSubtitle = "Tous mes remboursements";
  emptyMsg = "Aucun remboursement effectué au cours des 27 derniers mois";

  reimbFacadeService = inject(ReimbursementFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  downloadService = inject(FileDownloadService);
  toast = inject(ToastMessageService);

  currentParticipant$ = new BehaviorSubject<any>(null);
  reimbursmentList$ = new BehaviorSubject<any>(null);
  isHealth = false;
  isForesight = false;

  displayedColumns: string[] = [
    "dateRemboursementComplete",
    "montantVerseIpeca",
    "libelle",
    "download",
  ];

  constructor() {
    this.participantFacade.getCurrentParticipant().subscribe(participant => {
      this.currentParticipant$.next(participant);
      if (participant) {
        this.isHealth = participant.couvertureSante;
        this.isForesight =
          participant.couvertureArretTravail === true ||
          participant.couvertureDeces === true;
      }
      if (this.isHealth) {
        this.loadReimbursmentList(participant.numeroParticipant);
      } else if (this.isForesight) {
        this.reimbursmentTitle = "MES DERNIERS Règlements";
        this.reimbursmentSubtitle = "Tous mes règlements";
        this.loadReimbursmentForesightList(participant.numeroParticipant);
      }
    });
  }

  loadReimbursmentList(participantNumber: string) {
    this.refundListState$.next({ loading: true, error: null, data: [] });
    this.reimbFacadeService
      .fetchReimbursementHealtList(participantNumber)
      .pipe(
        map(list =>
          list.map((item: any) => ({
            ...item,
            montantVerseIpeca: parseFloat(
              String(item.montantVerseIpeca).replace(",", ".")
            ),
          }))
        )
      )
      .subscribe({
        next: value => {
          value = value.slice(0, 10);
          this.refundListState$.next({
            loading: false,
            error: null,
            data: value,
          });
          this.reimbursmentList$.next(value);
        },
        error: err => {
          this.refundListState$.next({
            loading: false,
            error: "Erreur lors du chargement",
            data: [],
          });
          this.toast.danger(
            "Oups",
            "Erreur lors du chargement des remboursements santé"
          );
        },
      });
  }

  loadReimbursmentForesightList(participantNumber: string) {
    this.reimbFacadeService
      .fetchReimbursementForesightList(participantNumber)
      .pipe(
        map(list =>
          list.map((item: any) => ({
            ...item,
            montantVerseIpeca: parseFloat(
              String(item.montantVerseIpeca).replace(",", ".")
            ),
          }))
        )
      )
      .subscribe({
        next: value => {
          value = value.slice(0, 10);
          this.refundListState$.next({ loading: true, error: null, data: [] });
          this.reimbursmentList$.next(value);
          console.log(this.reimbursmentList$.value);
        },
        error: err => {
          this.refundListState$.next({
            loading: false,
            error: "Erreur lors du chargement",
            data: [],
          });
          this.toast.danger(
            "Oups",
            "Erreur lors du chargement des remboursements santé"
          );
        },
      });
  }

  download(item: any) {
    this.reimbFacadeService
      .downloadRefundHealth(item, this.currentParticipant$.value.email)
      .subscribe({
        next: response => {
          if (response) {
            this.downloadDocument(response);
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
