import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CustomTabsComponent } from "../../../../../../shared-library/src/lib/presentation/layout/custom-tabs/custom-tabs.component";
import { GuaranteesHealthContentComponent } from "./tabs/guarantees-health-content/guarantees-health-content.component";
import { GuaranteesForesightContentComponent } from "./tabs/guarantees-foresight-content/guarantees-foresight-content.component";
import { combineLatest, take } from "rxjs";
import { ParticipantFacadeService } from "../../../core/services/participant-facade/participant-facade.service";

@Component({
  selector: "app-guarantees",
  imports: [
    CommonModule,
    CustomTabsComponent,
    MatGridListModule,
    RouterModule,
    GuaranteesHealthContentComponent,
    GuaranteesForesightContentComponent,
  ],
  templateUrl: "./guarantees.component.html",
  styleUrl: "./guarantees.component.scss",
})
export class GuaranteesComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private participantFacade = inject(ParticipantFacadeService);

  isHealthVisible = true;
  isForesightVisible = true;

  // 1. routing declaration
  private readonly routeMap = new Map<
    number,
    { tab: "sante" | "prevoyance"; route: string }
  >([
    [0, { tab: "sante", route: "notice-sante" }],
    [1, { tab: "sante", route: "completer-couverture-sante" }],
    [2, { tab: "prevoyance", route: "notice-prevoyance" }],
    [3, { tab: "prevoyance", route: "completer-couverture-prevoyance" }],
    [4, { tab: "sante", route: "cotisation-famille" }],
  ]);

  tabName: "Santé" | "Prévoyance" = "Santé";
  selectedItem: number = 0;

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
        this.isHealthVisible = isSante;
        this.isForesightVisible = isPrevoyance;
        if (isSante) {
          this.tabName = "Santé";
          this.router.navigate(["/mes-garanties/sante/notice-sante"]);
        } else if (isPrevoyance) {
          this.tabName = "Prévoyance";
          this.router.navigate(["/mes-garanties/prevoyance/notice-prevoyance"]);
        }
      });
  }

  private setupRouteListener(): void {
    this.route.url.pipe().subscribe(segments => {
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
        "mes-garanties",
        defaultRoute.tab,
        defaultRoute.route,
      ]);
    }
  }

  handleHealthSubmenuSelected(menuIndex: number): void {
    const routeConfig = this.routeMap.get(Number(menuIndex));
    if (routeConfig) {
      this.router.navigate([routeConfig.tab, routeConfig.route], {
        relativeTo: this.route,
        replaceUrl: true,
      });
    } else {
      console.error(`Aucune route trouvée pour le menu index: ${menuIndex}`);
    }
  }
}
