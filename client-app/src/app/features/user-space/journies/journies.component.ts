import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest, Subject, take, takeUntil } from "rxjs";
import { CustomTabsComponent } from "../../../../../../shared-library/src/lib/presentation/layout/custom-tabs/custom-tabs.component";
import { ParticipantFacadeService } from "../../../core/services/participant-facade/participant-facade.service";
import { ForesightJourniesComponent } from "./foresight-journies/foresight-journies.component";
import { HealthJourniesComponent } from "./health-journies/health-journies.component";

@Component({
  selector: "app-journies",
  imports: [
    CommonModule,
    CustomTabsComponent,
    MatGridListModule,
    HealthJourniesComponent,
    ForesightJourniesComponent,
    RouterModule,
  ],
  templateUrl: "./journies.component.html",
  styleUrl: "./journies.component.scss",
})
export class JourniesComponent {
  // dependencies
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private participantFacade = inject(ParticipantFacadeService);

  isHealthVisible = true;
  isForesightVisible = true;

  defaultRoute = "mes-demarches";

  //declarations
  private destroy$ = new Subject<void>();
  tabName: "Santé" | "Prévoyance" = "Santé";
  selectedItem: string = "1-1";
  selectedId = signal<any>(0);

  /* routing declarations */
  private readonly routeMap = new Map<
    string,
    { tab: "sante" | "prevoyance"; route: string }
  >([
    ["1-1", { tab: "sante", route: "priseECH" }],
    ["1-2", { tab: "sante", route: "demarche-devis" }],
    ["1-3", { tab: "sante", route: "demarche-remboursement" }],
    ["1-4", { tab: "sante", route: "informations" }],
    ["0", { tab: "sante", route: "devis-6-mois" }],
    ["2", { tab: "prevoyance", route: "transmettre-justificatif" }],
    ["3", { tab: "prevoyance", route: "demande-informations" }],
  ]);

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
        // Set visibility based on participant's coverage
        this.isHealthVisible = isSante;
        this.isForesightVisible = isPrevoyance;

        // Set default tab and route based on coverage
        if (isSante) {
          this.tabName = "Santé";
          this.selectedItem = "1-1";
          this.router.navigate(["/mes-demarches/sante/priseECH"]);
        } else if (isPrevoyance) {
          this.tabName = "Prévoyance";
          this.selectedItem = "2";
          this.router.navigate([
            "/mes-demarches/prevoyance/transmettre-justificatif",
          ]);
        }
      });
  }

  //methods
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
    if (tab === "sante") {
      this.selectedItem = "1-1";
      this.router.navigate(["priseECH"], {
        relativeTo: this.route,
        replaceUrl: true,
      });
    } else if (tab === "prevoyance") {
      this.selectedItem = "2";
      this.router.navigate(["transmettre-justificatif"], {
        relativeTo: this.route,
        replaceUrl: true,
      });
    }
  }

  eventTabChange(event: any): void {
    const tabIndex = event;
    const tabType = tabIndex === 0 ? "sante" : "prevoyance";

    if (tabType === "sante") {
      this.selectedItem = "1-1";
      this.router.navigate([this.defaultRoute, "sante", "priseECH"]);
    } else {
      this.selectedItem = "2";
      this.router.navigate([
        this.defaultRoute,
        "prevoyance",
        "transmettre-justificatif",
      ]);
    }
  }

  handleHealthSubmenuSelected(menuIndex: any): void {
    const routeConfig = this.routeMap.get(menuIndex);
    if (routeConfig) {
      this.selectedItem = menuIndex;
      this.router.navigate([routeConfig.tab, routeConfig.route], {
        relativeTo: this.route,
        replaceUrl: true,
      });
    }
  }
}
