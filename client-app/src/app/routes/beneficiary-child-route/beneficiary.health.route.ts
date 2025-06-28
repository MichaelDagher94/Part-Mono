import { Routes } from "@angular/router";
import { AddBeneficiaryComponent } from "../../features/user-space/beneficiairies/heath-content/add-beneficiary/add-beneficiary.component";
import { BeneficiaryListComponent } from "../../features/user-space/beneficiairies/heath-content/beneficiary-list/beneficiary-list.component";
import { MultiRibManagementComponent } from "../../features/user-space/beneficiairies/heath-content/multi-rib-management/multi-rib-management.component";
import { BeneficiaryEditPageComponent } from "../../features/user-space/beneficiairies/features/beneficiary-edit-page/beneficiary-edit-page.component";
import { BeneficiaryDeleteComponent } from "../../features/user-space/beneficiairies/features/beneficiary-delete/beneficiary-delete.component";

export const beneficiaryHealthRoute: Routes = [
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
        path: "liste",
        component: BeneficiaryListComponent,
        data: {
          breadcrumb: {
            alias: "listBeneficiary",
            label: "Liste des bénéficiaires",
          },
        },
      },
      {
        path: "ajouter-beneficiaire",
        component: AddBeneficiaryComponent,
        data: {
          breadcrumb: {
            alias: "addBeneficiary",
            label: "Ajouter un bénéficiaire",
          },
        },
      },
      {
        path: "modifier-bénéficiaire",
        component: BeneficiaryEditPageComponent,
        data: {
          breadcrumb: {
            alias: "editBeneficiary",
            label: "Modification d’un bénéficiaire",
          },
        },
      },
      {
        path: "retrait-bénéficiaire",
        component: BeneficiaryDeleteComponent,
        data: {
          breadcrumb: {
            alias: "deleteBeneficiary",
            label: "Retirer un bénéficiaire",
          },
        },
      },
      {
        path: "multi-rib",
        component: MultiRibManagementComponent,
        data: {
          breadcrumb: {
            alias: "multirib",
            label: "Gérer le multi rib",
          },
        },
      },
    ],
  },
];
