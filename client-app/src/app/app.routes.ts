import { Routes } from "@angular/router";
import { AuthGuard } from "../../../shared-library/src/lib/guards/auth/auth.guard";

import { LayoutWrapperComponent } from "./features/layout-wrapper/layout-wrapper.component";
import { PublicLayoutWrapperComponent } from "./features/public-space/public-layout-wrapper/public-layout-wrapper.component";
import { ClaimComponent } from "./features/user-space/dashboard/claim/claim.component";

export const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: LayoutWrapperComponent,
    data: { breadcrumb: "Mon tableau de bord" },
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./routes/user-space.route").then(m => m.userSpaceRoute),
      },
      {
        path: "reclamation",
        component: ClaimComponent,
        data: { breadcrumb: "Réclamation" },
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./routes/dashboard.route").then(m => m.dashboardRoute),
      },
      {
        path: "mes-demarches",
        loadChildren: () =>
          import("./routes/journies.routes").then(m => m.journiesRoutes),
      },
      {
        path: "mes-remboursements",
        loadChildren: () =>
          import("./routes/reimbursement.route").then(
            m => m.reimbursementRoute
          ),
      },
      {
        path: "mes-beneficiaires",
        loadChildren: () =>
          import("./routes/beneficiary.route").then(m => m.beneficiaryRoute),
      },
      {
        path: "mon-profil",
        loadChildren: () =>
          import("./routes/my-profil.route").then(m => m.myProfilRoute),
      },
      {
        path: "mes-garanties",
        loadChildren: () =>
          import("./routes/guarantees.route").then(m => m.guaranteesRoute),
      },
      {
        path: "mes-cartes-tp",
        loadChildren: () =>
          import("./routes/tp-cards.route").then(m => m.tpCardsRoute),
      },
    ],
  },
  {
    path: "",
    component: PublicLayoutWrapperComponent,
    data: { breadcrumb: "IPECA" },
    children: [
      {
        path: "actualites",
        loadChildren: () =>
          import("./routes/actuality.route").then(m => m.actualityRoute),
      },
    ],
  },
];
