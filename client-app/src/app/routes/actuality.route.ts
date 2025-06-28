import { Routes } from "@angular/router";
import { ActualityComponent } from "../features/public-space/actuality/actuality.component";

export const actualityRoute: Routes = [
  {
    path: "",
    component: ActualityComponent,
    data: { breadcrumb: "Actualités" },
  },
];
