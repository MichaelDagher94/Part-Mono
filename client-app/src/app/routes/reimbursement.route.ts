import { Routes } from "@angular/router";
import { ReimbursementsComponent } from "../features/user-space/reimbursements/reimbursements.component";

export const reimbursementRoute: Routes = [
  {
    path: "",
    component: ReimbursementsComponent,
    data: {
      breadcrumb: {
        alias: "Mes remboursements",
        label: "MES REMBOURSEMENTS",
      },
    },
  },
];
