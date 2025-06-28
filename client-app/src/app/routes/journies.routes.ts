import { Routes } from "@angular/router";
import { JourniesComponent } from "../features/user-space/journies/journies.component";
import { HospitalCoverageComponent } from "../features/user-space/journies/pages/hospital-coverage/hospital-coverage.component";
import { OtherQuestionsComponent } from "../features/user-space/journies/pages/other-questions/other-questions.component";
import { QuoteRequestComponent } from "../features/user-space/journies/pages/quote-request/quote-request.component";
import { QuoteReviewComponent } from "../features/user-space/journies/pages/quote-review/quote-review.component";
import { ReimbursementRequestComponent } from "../features/user-space/journies/pages/reimbursement-request/reimbursement-request.component";
import { ProofProviderComponent } from "../features/user-space/journies/pages/proof-provider/proof-provider.component";
import { RequestInformationComponent } from "../features/user-space/journies/pages/request-information/request-information.component";

export const journiesRoutes: Routes = [
  {
    path: "",
    component: JourniesComponent,
    data: { breadcrumb: "MES DEMARCHES" },
    children: [
      {
        path: "sante",
        data: {
          breadcrumb: {
            alias: "sante",
            label: "Santé",
          },
        },
        children: [
          {
            path: "devis-6-mois",
            component: QuoteReviewComponent,
            data: {
              breadcrumb: {
                alias: "listeDevis",
                label: "Consulter mes devis",
              },
            },
          },
          {
            path: "priseECH",
            component: HospitalCoverageComponent,
            data: {
              breadcrumb: {
                alias: "hospitalCoverage",
                label: "Prise en Charge Hospitalière",
              },
            },
          },
          {
            path: "demarche-devis",
            component: QuoteRequestComponent,
            data: {
              breadcrumb: {
                alias: "demarcheDevis",
                label: "Devis",
              },
            },
          },
          {
            path: "demarche-remboursement",
            component: ReimbursementRequestComponent,
            data: {
              breadcrumb: {
                alias: "demarcheRemboursement",
                label: "Remboursement",
              },
            },
          },
          {
            path: "informations",
            component: OtherQuestionsComponent,
            data: {
              breadcrumb: {
                alias: "autrequestion",
                label: "Autres questions",
              },
            },
          },
        ],
      },
      {
        path: "prevoyance",
        data: {
          breadcrumb: {
            alias: "prevoyance",
            label: "Prévoyance",
          },
        },
        children: [
          {
            path: "transmettre-justificatif",
            component: ProofProviderComponent,
            data: {
              breadcrumb: {
                alias: "proofProvider",
                label: "Transmettre un justificatif",
              },
            },
          },
          {
            path: "demande-informations",
            component: RequestInformationComponent,
            data: {
              breadcrumb: {
                alias: "requestInformation",
                label: "Demande d'information",
              },
            },
          },
        ],
      },
    ],
  },
];
