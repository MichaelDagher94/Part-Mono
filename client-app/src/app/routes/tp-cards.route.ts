import { Routes } from "@angular/router";
import { TpCardsComponent } from "../features/user-space/tp-cards/tp-cards.component";

export const tpCardsRoute: Routes = [
  {
    path: "",
    component: TpCardsComponent,
    data: {
      breadcrumb: {
        alias: "tpcards",
        label: "MES CARTES TP",
      },
    },
  },
];
