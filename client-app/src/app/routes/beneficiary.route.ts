import { Routes } from "@angular/router";
import { BeneficiairiesComponent } from "../features/user-space/beneficiairies/beneficiairies.component";
import { BeneficiaryDeleteComponent } from "../features/user-space/beneficiairies/features/beneficiary-delete/beneficiary-delete.component";
import { MultiRibAddComponent } from "../features/user-space/beneficiairies/heath-content/multi-rib-add/multi-rib-add.component";

export const beneficiaryRoute: Routes = [
  {
    path: "",
    component: BeneficiairiesComponent,
    data: {
      breadcrumb: {
        alias: "Mes Bénéficiaires",
        label: "MES BENEFICIAIRES",
      },
    },
    children: [
      {
        path: "sante",
        loadChildren: () =>
          import("./beneficiary-child-route/beneficiary.health.route").then(
            m => m.beneficiaryHealthRoute
          ),
      },
      {
        path: "prevoyance",
        loadChildren: () =>
          import("./beneficiary-child-route/beneficiary.foresight.route").then(
            m => m.beneficiaryForesightRoute
          ),
      },

      {
        path: "ajouter-multi-rib/:id",
        component: MultiRibAddComponent,
        data: {
          breadcrumb: {
            alias: "addmultirib",
            label: "Ajouter multi RIB",
          },
        },
      },
    ],
  },
];
