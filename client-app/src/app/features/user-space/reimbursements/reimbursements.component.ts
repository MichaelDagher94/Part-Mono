import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTableModule } from "@angular/material/table";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { BreadcrumbService } from "xng-breadcrumb";
import { ForesightRequest } from "../../../../../../shared-library/src/lib/models/myrefunds/request/ForesightRequest";
import { ForesightSearch } from "../../../../../../shared-library/src/lib/models/myrefunds/request/ForesightSearch";
import { RefundSearchMultiCriteria } from "../../../../../../shared-library/src/lib/models/myrefunds/request/RefundSearchMultiCriteria";
import { RemboursementRequest } from "../../../../../../shared-library/src/lib/models/myrefunds/request/RemboursementRequest";
import { CustomTabsComponent } from "../../../../../../shared-library/src/lib/presentation/layout/custom-tabs/custom-tabs.component";
import { ToastMessageService } from "../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FileDownloadService } from "../../../../../../shared-library/src/lib/services/download/file-download.service";
import { MyRefundService } from "../../../../../../shared-library/src/lib/services/my-refund/my-refund.service";
import { ParticipantFacadeService } from "../../../core/services/participant-facade/participant-facade.service";
import { BenefitsContentComponent } from "./benefits-content/benefits-content.component";
import { HealthContentComponent } from "./health-content/health-content.component";
import { ReimbursementDataTableComponent } from "./reimbursement-data-table/reimbursement-data-table.component";
import { ListState } from "../../../../../../shared-library/src/lib/models/state/list-state.model";
import { CommonModule } from "@angular/common";
import { SkeletonTableLoaderComponent } from "../../../../../../shared-library/src/lib/presentation/layout/loader/skeleton-table-loader/skeleton-table-loader.component";

@Component({
  selector: "app-reimbursements",
  imports: [
    CommonModule,
    CustomTabsComponent,
    HealthContentComponent,
    BenefitsContentComponent,
    MatGridListModule,
    MatTableModule,
    ReimbursementDataTableComponent,
    SkeletonTableLoaderComponent,
  ],
  templateUrl: "./reimbursements.component.html",
  styleUrl: "./reimbursements.component.scss",
})
export class ReimbursementsComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly participantFacadeService = inject(ParticipantFacadeService);
  private readonly myRefundService = inject(MyRefundService);
  private toast = inject(ToastMessageService);
  private readonly downloadService = inject(FileDownloadService);

  isHealthVisible = true;
  isForesightVisible = true;

  isSearch = {
    health: false,
    foresight: false,
  };
  // isLoading = this.myRefundService.loading();

  showSante: boolean = true;
  loggedUser: any;
  tabName: "Santé" | "Prévoyance" = "Santé";
  dataHealth: any[] = [];
  dataForesight: any[] = [];

  refundListState$ = new BehaviorSubject<ListState<any>>({
    loading: false,
    error: null,
    data: [],
  });

  columns = [
    "truncatDateDeRemboursement",
    "libelle",
    "depense",
    "montantVerseIpeca",
    "rac",
  ];
  foresightColumns = [
    "truncatDateDeRemboursement",
    "libelle",
    "montantBrut",
    "montantNetFiscal",
    "montant",
  ];
  currencyColumns = ["depense", "montantVerseIpeca", "rac"];

  foresightcolumnTitles = {
    truncatDateDeRemboursement: "Date de règlement",
    libelle: "Destinataire de règlement",
    montantBrut: "Montant Brut",
    montantNetFiscal: "Montant Net Fiscal",
    montant: "Montant net réglé par IPECA",
  };
  columnTitles = {
    truncatDateDeRemboursement: "Date de remboursement",
    libelle: "Destinataire de remboursement",
    depense: "Montant des frais réels",
    montantVerseIpeca: "Montant versé par Ipeca",
    rac: "Montant reste à charge",
  };

  refundData: RemboursementRequest = new RemboursementRequest({
    numParticipant: "",
    dateDeRemboursement1: "",
    dateDeRemboursement2: "",
    nombreDeLignes: "",
    montant: 0,
    datePrevoyance: "",
    natureDeSoins: "",
    beneficiaire: "",
    decompteParticipant: "",
    dateEmission: "",
    decompteCode: "",
    envoiemail: "",
    emailSender: "",
    isSiteWeb: false,
    platform: "",
    browser: "",
    engine: "",
    numeroBordereau: "",
    codeBordereau: "",
  });

  foresightData = new ForesightRequest({
    numParticipant: "",
    dateDeRemboursement1: "",
    dateDeRemboursement2: "",
    nombreDeLignes: "",
    montant: 0,
    datePrevoyance: "",
    natureDeSoins: "",
    beneficiaire: "",
    decompteParticipant: "",
    dateEmission: "",
    decompteCode: "",
    envoiemail: "",
    emailSender: "",
    isSiteWeb: true,
    platform: "",
    browser: "",
    engine: "",
    numeroBordereau: "",
    codeBordereau: "",
  });

  ngOnInit(): void {
    this.setTabSelection();
    this.participantFacadeService
      .getCurrentParticipant()
      .subscribe((response: any) => {
        if (!response) return;

        this.loggedUser = response;
        this.checkDisplayedTab();
      });
  }

  checkDisplayedTab() {
    const isSante =
      this.loggedUser.isSante !== false &&
      this.loggedUser.couvertureSante !== false;
    const isPrevoyance =
      this.loggedUser.couvertureArretTravail === true ||
      this.loggedUser.couvertureDeces === true;

    this.isHealthVisible = isSante;
    this.isForesightVisible = isPrevoyance;

    if (!isSante) {
      this.showSante = false;
      this.tabName = "Prévoyance";
      this.loadForesightList();
      this.setTabSelection();
    } else {
      this.showSante = true;
      this.tabName = "Santé";
      this.loadRefundLists();
      this.setTabSelection();
    }
  }

  loadRefundLists() {
    this.refundListState$.next({ loading: true, error: null, data: [] });
    this.refundData.numParticipant = this.loggedUser.numeroParticipant;
    this.myRefundService.healthRefund(this.refundData).subscribe({
      next: (data: any) => {
        this.refundListState$.next({ loading: false, error: null, data });
        this.dataHealth = data.map((item: any) => ({
          ...item,
          truncatDateDeRemboursement: `${item.truncatDateDeRemboursement}.`,
          canDownload: this.checkDownloadEligibility(item),
        }));
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
        ),
          console.error(
            "Erreur lors du chargement des remboursements santé :",
            err
          );
      },
    });
  }

  loadForesightList() {
    this.refundListState$.next({ loading: true, error: null, data: [] });
    this.foresightData.numParticipant = this.loggedUser.numeroParticipant;
    this.myRefundService.foresightRefund(this.foresightData).subscribe({
      next: (data: any) => {
        this.refundListState$.next({ loading: false, error: null, data });
        this.dataForesight = data.map((item: any) => ({
          ...item,
          truncatDateDeRemboursement: `${item.truncatDateDeRemboursement}.`,
          canDownload: item.pdf,
          montantBrut: `${item.montantBrut}€`,
          montantNetFiscal: `${item.montantNetFiscal}€`,
          montant: `${item.montant}€`,
        }));
      },
      error: err => {
        this.refundListState$.next({
          loading: false,
          error: err,
          data: [],
        });
        this.toast.danger(
          "Oups",
          "Erreur lors du chargement des remboursements prévoyance"
        ),
          console.error(
            "Erreur lors du chargement des remboursements prévoyance :",
            err
          );
      },
    });
  }

  checkDownloadEligibility(row: any): boolean {
    if (!this.loggedUser) {
      console.error("Utilisateur non connecté ou données manquantes.");
      row.canDownload = false;
      return false;
    }

    const hasValidAttestation =
      this.loggedUser.numAttestation ||
      this.loggedUser.numAttestationFuture ||
      this.loggedUser.numAttestationFutureDetenteur ||
      this.loggedUser.numAttestationParticipant ||
      this.loggedUser.numAttestationFutureParticipant ||
      this.loggedUser.numeroIdentifiant ||
      this.loggedUser.numeroParticipant ||
      this.loggedUser.numeroSecuriteSociale;
    row.canDownload = hasValidAttestation;
    return row.canDownload;
  }

  eventTabChange(value: any): void {
    this.showSante = value === 0;
    this.tabName = this.showSante ? "Santé" : "Prévoyance";
    this.setTabSelection();
  }

  private setTabSelection(): void {
    this.breadcrumbService.set(
      "@Mes remboursements",
      `Mes remboursements / ${this.tabName}`
    );
  }
  private addOneDay(date: string) {
    if (!date) {
      return date;
    }
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    return newDate.toISOString();
  }
  get currentSearch(): boolean {
    return this.showSante ? this.isSearch.health : this.isSearch.foresight;
  }

  search(event: any): void {
    try {
      this.isSearch[this.showSante ? "health" : "foresight"] = true;
      // Validation des dates
      const careDateTo = event.careDateTo
        ? this.addOneDay(event.careDateTo)
        : event.careDateTo;
      const refundDateTo = event.reimbursementDateTo
        ? this.addOneDay(event.reimbursementDateTo)
        : event.reimbursementDateTo;

      // Création des critères de recherche
      const searchCriteria = new RefundSearchMultiCriteria({
        participantID: this.loggedUser?.numeroParticipant ?? "",
        dateDeRemboursementMin: event.reimbursementDateFrom ?? "",
        dateDeRemboursementMax: refundDateTo ?? "",
        dateDeSoinMin: event.careDateFrom ?? "",
        dateDeSoinMax: careDateTo ?? "",
        beneficiaire: event.beneficiary ?? "",
        natureDeSoins: event.careType ?? "",
      });

      // Appel au service
      this.myRefundService.searchMultiCriteria(searchCriteria).subscribe({
        next: (data: any) => {
          this.dataHealth = data.map((item: any) => ({
            ...item,
            truncatDateDeRemboursement: `${item.truncatDateDeRemboursement}.`,
            canDownload: this.checkDownloadEligibility(item),
          }));
        },
        error: (err: any) => {
          console.error(
            "Erreur lors du chargement des remboursements santé :",
            err
          );
          this.toast.danger(
            "Oups",
            "Erreur lors du chargement des remboursements santé. Veuillez réessayer plus tard."
          );
        },
      });
    } catch (error) {
      console.error("Erreur dans la méthode search :", error);
      this.toast.danger(
        "Oups",
        "Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
      );
    }
  }

  searchForesight(event: any): void {
    this.isSearch[this.showSante ? "health" : "foresight"] = true;
    const searchCriteria = new ForesightSearch({
      numeroParticipant: this.loggedUser.numeroParticipant,
      dateIndemnisationMin: event.compensationDateFrom,
      dateIndemnisationMax: event.compensationDateTo,
      dateVersementMin: event.payoutDateFrom,
      dateVersementMax: event.payoutDateTo,
    });

    this.myRefundService
      .searchForesightByDate(searchCriteria)
      .subscribe(data => (this.dataForesight = data));
  }

  handleDownloadForesight(row: any) {
    row = row.data;
    const expenseId = row.identifiant_Decompte;
    const typeDocument = "DecomptePrevoyance";

    this.myRefundService
      .GetExpenseFileAsyncV2(expenseId, typeDocument)
      .pipe(
        tap(result => {
          if (result) {
            console.log(result);
            if (result.message_Retour_nombre > 0) {
              this.toast.warning(
                result.message_Retour.type,
                result.message_Retour.message
              );
              return;
            }
            this.downloadService.downloadPdf(
              result.pdf,
              result.nom || result.nomPDF
            );
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.toast.danger(
            "Oups",
            "Erreur lors du téléchargement des remboursements. Veuillez réessayer plus tard "
          ),
            console.error("Erreur API complète :", error);
          console.error("Erreur status :", error.status);
          console.error("Erreur message :", error.message);
          console.error("Erreur détails :", error.error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }
  handleDownload(row: any) {
    row = row.data;
    let montant = Number(row.montantVerseIpeca.replace(",", "."));
    const downloadData = {
      participantNumber: row.numeroParticipant,
      amount: montant,
      refundDate: new Date(row.dateRemboursementComplete),
      ENVOIEMAIL: "0",
      participantEmail: this.loggedUser.email,
      codeBordereau: row.codeBordereau,
      numeroBordereau: row.numeroBordereau,
      natureSoin: row.remboursementsSanteDetail[0].libelle || "",
      beneficiaire: String(row.remboursementsSanteDetail[0].beneficiaire),
      nbrLignes: String(row.remboursementsSanteDetail.length) || "0",
    };

    this.myRefundService
      .GetExpenseFileAsync(downloadData)
      .pipe(
        tap(result => {
          if (result) this.downloadService.downloadPdf(result.pdf, result.nom);
        }),
        catchError((error: HttpErrorResponse) => {
          this.toast.danger(
            "Oups",
            "Erreur lors du téléchargement des remboursements. Veuillez réessayer plus tard "
          ),
            console.error("Erreur API complète :", error);
          console.error("Erreur status :", error.status);
          console.error("Erreur message :", error.message);
          console.error("Erreur détails :", error.error); // Voir le vrai message de l'API
          return throwError(() => error);
        })
      )
      .subscribe();
  }
}
