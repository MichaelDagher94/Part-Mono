import { Routes } from "@angular/router";
import { DashboardComponent } from "../features/user-space/dashboard/dashboard.component";
import { ClaimComponent } from "../features/user-space/dashboard/claim/claim.component";

export const dashboardRoute: Routes = [
  {
    path: "",
    component: DashboardComponent,
    data: { breadcrumb: "Tableau de Bord" },
  },
];
