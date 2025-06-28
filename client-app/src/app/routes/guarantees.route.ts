import { Routes } from "@angular/router";
import { GuaranteesComponent } from "../features/user-space/guarantees/guarantees.component";

export const guaranteesRoute: Routes = [
  {
    path: "",
    component: GuaranteesComponent,
    data: { breadcrumb: "MES GARANTIES" },
    children: [
      {
        path: "sante",
        loadChildren: () =>
          import("./guarantes-child-route/guarantees-health.route").then(
            m => m.guarantessHealthRoute
          ),
      },
      {
        path: "prevoyance",
        loadChildren: () =>
          import("./guarantes-child-route/guarantees-foresight.route").then(
            m => m.guarantessForesightRoute
          ),
      },
    ],
  },
];
