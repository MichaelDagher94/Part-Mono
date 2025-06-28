import { Routes } from "@angular/router";
import { FamilyContributionComponent } from "../../features/user-space/guarantees/pages/family-contribution/family-contribution.component";
import { GuaranteesCompleteCoverHealthComponent } from "../../features/user-space/guarantees/pages/guarantees-complete-cover-health/guarantees-complete-cover-health.component";
import { GuaranteesNoticeHealthComponent } from "../../features/user-space/guarantees/pages/guarantees-notice-health/guarantees-notice-health.component";

export const guarantessHealthRoute: Routes = [
  {
    path: "",
    data: {
      breadcrumb: {
        alias: "sante",
        label: "Santé",
      },
    },
    children: [
      {
        path: "notice-sante",
        component: GuaranteesNoticeHealthComponent,
        data: {
          breadcrumb: {
            alias: "noticeSante",
            label: "Mes notices",
          },
        },
      },
      {
        path: "cotisation-famille",
        component: FamilyContributionComponent,
        data: {
          breadcrumb: {
            alias: "familyContribution",
            label: "Cotisation famille",
          },
        },
      },
      {
        path: "completer-couverture-sante",
        component: GuaranteesCompleteCoverHealthComponent,
        data: {
          breadcrumb: {
            alias: "noticePrevoyance",
            label: "Compléter ma couverture santé",
          },
        },
      },
    ],
  },
];
