import { Routes } from "@angular/router";
import { ProfileComponent } from "../features/user-space/profile/profile.component";
import { SecuritiesComponent } from "../features/user-space/profile/pages/securities/securities.component";
import { BankDetailsComponent } from "../features/user-space/profile/pages/bank-details/bank-details.component";
import { TeletransmissionComponent } from "../features/user-space/profile/pages/teletransmission/teletransmission.component";
import { MyDocumentsComponent } from "../features/user-space/profile/pages/my-documents/my-documents.component";
import { PortabilityComponent } from "../features/user-space/profile/pages/portability/portability.component";
import { ConsentComponent } from "../features/user-space/profile/pages/consent/consent.component";
import { PersonnalDataComponent } from "../features/user-space/profile/pages/personnal-data/personnal-data.component";
import { PersonalDataEditComponent } from "../features/user-space/profile/pages/personnal-data/personal-data-edit/personal-data-edit.component";
import { EmailEditComponent } from "../features/user-space/profile/pages/securities/email-edit/email-edit.component";
import { PasswordEditComponent } from "../features/user-space/profile/pages/securities/password-edit/password-edit.component";
import { BankDetailsEditComponent } from "../features/user-space/profile/pages/bank-details/bank-details-edit/bank-details-edit.component";

export const myProfilRoute: Routes = [
  {
    path: "",
    component: ProfileComponent,
    data: { breadcrumb: "Mon profil" },
    children: [
      { path: "", redirectTo: "donnees-personnelles", pathMatch: "full" },
      {
        path: "donnees-personnelles",
        component: PersonnalDataComponent,
        data: { breadcrumb: "Données personnelles" },
      },
      {
        path: "modification-donnees-personnelles",
        component: PersonalDataEditComponent,
        data: { breadcrumb: "Données personnelles" },
      },
      {
        path: "connexion-et-sécurite",
        component: SecuritiesComponent,
        data: { breadcrumb: "Connexion et sécurité" },
      },
      {
        path: "connexion-et-sécurite/email/modification",
        component: EmailEditComponent,
        data: { breadcrumb: "Connexion et sécurité" },
      },
      {
        path: "connexion-et-sécurite/motdepasse/modification",
        component: PasswordEditComponent,
        data: { breadcrumb: "Connexion et sécurité" },
      },
      {
        path: "coordonnées-bancaires",
        component: BankDetailsComponent,
        data: { breadcrumb: "Coordonnées bancaires" },
      },
      {
        path: "coordonnées-bancaires/modification",
        component: BankDetailsEditComponent,
        data: { breadcrumb: "Coordonnées bancaires" },
      },
      {
        path: "teletransmission",
        component: TeletransmissionComponent,
        data: { breadcrumb: "Télétransmission" },
      },
      {
        path: "mes-documents",
        component: MyDocumentsComponent,
        data: { breadcrumb: "Mes documents" },
      },
      {
        path: "portabilite",
        component: PortabilityComponent,
        data: { breadcrumb: "Portabilité" },
      },
      {
        path: "consentements",
        component: ConsentComponent,
        data: { breadcrumb: "Consentements" },
      },
    ],
  },
];
