import { Routes } from "@angular/router";
import { GuaranteesCompleteCoverForesightComponent } from "../../features/user-space/guarantees/pages/guarantees-complete-cover-foresight/guarantees-complete-cover-foresight.component";
import { GuaranteesNoticeForesightComponent } from "../../features/user-space/guarantees/pages/guarantees-notice-foresight/guarantees-notice-foresight.component";

export const guarantessForesightRoute: Routes = [
  {
    path: "",
    data: {
      breadcrumb: {
        alias: "prevoyance",
        label: "Prévoyance",
      },
    },
    children: [
      {
        path: "notice-prevoyance",
        component: GuaranteesNoticeForesightComponent,
        data: {
          breadcrumb: {
            alias: "noticePrevoyance",
            label: "Mes notices prévoyance",
          },
        },
      },
      {
        path: "completer-couverture-prevoyance",
        component: GuaranteesCompleteCoverForesightComponent,
        data: {
          breadcrumb: {
            alias: "completerCouverturePrevoyance",
            label: "Compléter ma couverture prévoyance",
          },
        },
      },
    ],
  },
];
