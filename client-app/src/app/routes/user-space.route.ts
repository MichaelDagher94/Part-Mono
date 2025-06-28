import { Routes } from "@angular/router";
import { UserSpaceComponent } from "../features/user-space/user-space.component";

export const userSpaceRoute: Routes = [
  {
    path: "",
    component: UserSpaceComponent,
    data: { breadcrumb: "Espace utilisateur" },
  },
];
