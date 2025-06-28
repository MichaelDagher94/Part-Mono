import { Routes } from "@angular/router";
import { DeathOptionChoiceComponent } from "../../features/user-space/beneficiairies/foresight-beneficiary/death-option-choice/death-option-choice.component";
import { DesignationBeneficiaryComponent } from "../../features/user-space/beneficiairies/foresight-beneficiary/designation-beneficiary/designation-beneficiary.component";

export const beneficiaryForesightRoute: Routes = [
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
        path: "designation-beneficiaire",
        component: DesignationBeneficiaryComponent,
        data: {
          breadcrumb: {
            alias: "designationBeneficiary",
            label: "Désignation bénéficiaire",
          },
        },
      },
      {
        path: "option-deces",
        component: DeathOptionChoiceComponent,
        data: {
          breadcrumb: {
            alias: "optionDeces",
            label: "Choix option décès",
          },
        },
      },
    ],
  },
];
