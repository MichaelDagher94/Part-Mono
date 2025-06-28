import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { BehaviorSubject, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BeneficiaryRequest } from "../../../../../../../../shared-library/src/lib/models/beneficiary/request/BeneficiaryRequest";
import { CustomTableComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/custom-table/custom-table.component";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { AuthenticationService } from "../../../../../../../../shared-library/src/lib/services/authentication/authentication.service";
import { BeneficiaryService } from "../../../../../../../../shared-library/src/lib/services/beneficiary/beneficiary.service";
import { FileDownloadService } from "../../../../../../../../shared-library/src/lib/services/download/file-download.service";
import { ParticipantFacadeService } from "../../facades/participant/participant-facade.service";
import {
  SSNPatternApply,
  checkDownloadEligibility,
} from "../../services/beneficiaries.web.service";
import { ListState } from "../../../../../../../../shared-library/src/lib/models/state/list-state.model";
import { CommonModule } from "@angular/common";
import { SkeletonTableLoaderComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/loader/skeleton-table-loader/skeleton-table-loader.component";

@Component({
  selector: "app-beneficiary-list",
  standalone: true,
  imports: [CustomTableComponent, CommonModule, SkeletonTableLoaderComponent],
  templateUrl: "./beneficiary-list.component.html",
  styleUrl: "./beneficiary-list.component.scss",
})
export class BeneficiaryListComponent implements OnInit, OnDestroy {
  // === Dependencies ===
  private readonly authService = inject(AuthenticationService);
  private readonly beneficiaryService = inject(BeneficiaryService);
  private readonly destroyRef = inject(DestroyRef);
  private participantFacade = inject(ParticipantFacadeService);
  private downloadService = inject(FileDownloadService);
  private router = inject(Router);
  private toast = inject(ToastMessageService);

  beneficiaryListState$ = new BehaviorSubject<ListState<any>>({
    loading: false,
    error: null,
    data: [],
  });

  // === State ===
  connectedUser = signal<any>(null);
  dataToShow: any;

  readonly columns = [
    "nomComplet",
    "dateDeNaissance",
    "dateAffiliation",
    "genre",
    "numeroSecuriteSociale",
  ];

  readonly columnTitles: Record<string, string> = {
    nomComplet: "Prénom Nom",
    dateDeNaissance: "Date de Naissance",
    dateAffiliation: "Affilié(e) depuis le",
    genre: "genre",
    numeroSecuriteSociale: "Numéro de sécurité sociale",
    download: "Carte TP",
  };

  ngOnInit(): void {
    this.loadConnectedUser();
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
    this.beneficiaryListState$.next({ loading: true, error: null, data: [] });
    const beneficiaryRequest = new BeneficiaryRequest();
    (beneficiaryRequest.numParticipant = numeroParticipant),
      this.beneficiaryService
        .getAllBeneficiariesWithoutMe(beneficiaryRequest)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          map(beneficiaries =>
            beneficiaries?.map((beneficiary: any) => ({
              ...beneficiary,
              genre: beneficiary.genre === 1 ? "Masculin" : "Féminin",
              numeroSecuriteSociale: SSNPatternApply(
                beneficiary.numeroSecuriteSociale
              ),
              numeroSecuriteSociale2: SSNPatternApply(
                beneficiary.numeroSecuriteSociale2
              ),
              canDownload: this.checkDownload(beneficiary),
            }))
          ),
          catchError(err => {
            this.toast.danger("Erreur", "Impossible de charger les données");
            return of([]);
          })
        )
        .subscribe({
          next: beneficiaries => {
            this.beneficiaryListState$.next({
              loading: false,
              error: null,
              data: beneficiaries as any[],
            });
            this.dataToShow = beneficiaries;
          },
          error: err => {
            this.beneficiaryListState$.next({
              loading: false,
              error: err,
              data: [],
            });
            console.error("Erreur chargement des bénéficiaires :", err);
          },
        });
  }

  private checkDownload(row: any): boolean {
    const user = this.connectedUser();

    if (!user) {
      console.error("Utilisateur non connecté ou données manquantes.");
      row.canDownload = false;
      return false;
    }
    return checkDownloadEligibility(row);
  }

  handleDownload(row: any): void {
    const payload = {
      participantNumber: this.connectedUser().numeroParticipant,
      certificateNumber: this.connectedUser().numAttestation,
      participantId: this.connectedUser().id,
      emailParticipant: this.connectedUser().email,
    };

    this.participantFacade.downloadThirdPartyPayings(payload).subscribe({
      next: res => {
        if (res) this.downloadService.downloadPdf(res.pdf, res.nom);
        else {
          this.toast.danger(
            "Oups",
            "Erreur lors du téléchargement. Veuillez réessayer plus tard "
          );
        }
      },
      error: err => {
        this.toast.danger(
          "Oups",
          "Erreur lors du téléchargement. Veuillez réessayer plus tard "
        );
      },
    });
  }

  handleEdit(rowSelected: any): void {
    this.router.navigate(["mes-beneficiaires/sante/modifier-bénéficiaire"], {
      state: { id: rowSelected.id },
    });
  }

  handleDelete(row: any): void {
    if (!row || !this.connectedUser()) return;

    this.router.navigate(["mes-beneficiaires/sante/retrait-bénéficiaire"], {
      state: { id: row.id },
    });
  }

  ngOnDestroy(): void {
    // automatic with  DestroyRef + takeUntilDestroyed
  }
}
