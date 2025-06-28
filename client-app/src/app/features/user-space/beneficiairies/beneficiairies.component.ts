import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest, Subject, take, takeUntil } from "rxjs";
import { CustomTabsComponent } from "../../../../../../shared-library/src/lib/presentation/layout/custom-tabs/custom-tabs.component";
import { ForesightBeneficiaryComponent } from "./foresight-beneficiary/foresight-beneficiary.component";
import { HeathContentComponent } from "./heath-content/heath-content.component";
import { ParticipantService } from "../../../../../../shared-library/src/lib/services/participant/participant.service";
import { ParticipantFacadeService } from "../../../core/services/participant-facade/participant-facade.service";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-beneficiairies",
  standalone: true,
  imports: [
    CommonModule,
    CustomTabsComponent,
    MatGridListModule,
    HeathContentComponent,
    ForesightBeneficiaryComponent,
    RouterModule,
  ],
  templateUrl: "./beneficiairies.component.html",
  styleUrl: "./beneficiairies.component.scss",
})
export class BeneficiairiesComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private participantFacade = inject(ParticipantFacadeService);

  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant(),
    {
      initialValue: null,
    }
  );

  // 1. routing declaration
  private readonly routeMap = new Map<
    number,
    { tab: "sante" | "prevoyance"; route: string }
  >([
    [0, { tab: "sante", route: "liste" }],
    [1, { tab: "sante", route: "ajouter-beneficiaire" }],
    [4, { tab: "sante", route: "multi-rib" }],
    [2, { tab: "prevoyance", route: "designation-beneficiaire" }],
    [3, { tab: "prevoyance", route: "option-deces" }],
  ]);

  // 2. declaration
  tabName: "Santé" | "Prévoyance" = "Santé";
  selectedItem: number = 0;

  // 3. data & columns
  dataHealth: any[] = [];
  columns = [
    "dateDeRemboursement",
    "libelle",
    "depense",
    "montantVerseIpeca",
    "rac",
    "download",
  ];

  columnTitles: Record<string, string> = {
    dateDeRemboursement: "Prénom Nom",
    libelle: "Date de Naissance",
    depense: "Affilié(e) depuis le",
    montantVerseIpeca: "Genre",
    rac: "Numéro de sécurité sociale",
    download: "Carte TP",
  };

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setupRouteListener();
    this.checkDisplayedTab();
  }

  checkDisplayedTab() {
    combineLatest([
      this.participantFacade.isSante(),
      this.participantFacade.isPrevoyance(),
    ])
      .pipe(take(1))
      .subscribe(([isSante, isPrevoyance]) => {
        if (isSante) {
          this.tabName = "Santé";
          this.router.navigate(["/mes-beneficiaires/sante/liste"]);
        } else if (isPrevoyance) {
          this.tabName = "Prévoyance";
          this.router.navigate([
            "/mes-beneficiaires/prevoyance/designation-beneficiaire",
          ]);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRouteListener(): void {
    this.route.url.pipe(takeUntil(this.destroy$)).subscribe(segments => {
      const currentTab = segments[0]?.path as "sante" | "prevoyance";
      const currentRoute = segments[1]?.path;

      if (!currentRoute && currentTab) {
        this.redirectToDefaultRoute(currentTab);
        return;
      }

      this.updateSelectedItem(currentTab, currentRoute);
    });
  }

  private updateSelectedItem(tab: string, route: string): void {
    const foundEntry = Array.from(this.routeMap.entries()).find(
      ([_, config]) => config.tab === tab && config.route === route
    );

    if (foundEntry) {
      this.selectedItem = foundEntry[0];
      this.tabName = foundEntry[1].tab === "sante" ? "Santé" : "Prévoyance";
    }
  }

  private redirectToDefaultRoute(tab: "sante" | "prevoyance"): void {
    const defaultRoute = Array.from(this.routeMap.values()).find(
      config => config.tab === tab
    );

    if (defaultRoute) {
      this.router.navigate([defaultRoute.route], {
        relativeTo: this.route,
        replaceUrl: true,
      });
    }
  }

  eventTabChange(event: any): void {
    const tabIndex = event;
    const tabType = tabIndex === 0 ? "sante" : "prevoyance";
    const defaultRoute = Array.from(this.routeMap.values()).find(
      config => config.tab === tabType
    );

    if (defaultRoute) {
      this.router.navigate([
        "mes-beneficiaires",
        defaultRoute.tab,
        defaultRoute.route,
      ]);
    }
  }

  handleHealthSubmenuSelected(menuIndex: number): void {
    const routeConfig = this.routeMap.get(menuIndex);
    if (routeConfig) {
      this.router.navigate([routeConfig.tab, routeConfig.route], {
        relativeTo: this.route,
        replaceUrl: true,
      });
    }
  }
}
