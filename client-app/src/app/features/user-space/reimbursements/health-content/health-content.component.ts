import { CommonModule, registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {
  Component,
  EventEmitter,
  LOCALE_ID,
  OnInit,
  Output,
  inject,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { BeneficiaryRequest } from "../../../../../../../shared-library/src/lib/models/beneficiary/request/BeneficiaryRequest";
import { CustomSelectComponent } from "../../../../../../../shared-library/src/lib/presentation/layout/custom-select/custom-select.component";
import { AuthenticationService } from "../../../../../../../shared-library/src/lib/services/authentication/authentication.service";
import { BeneficiaryService } from "../../../../../../../shared-library/src/lib/services/beneficiary/beneficiary.service";
import { MyRefundService } from "../../../../../../../shared-library/src/lib/services/my-refund/my-refund.service";

import { CustomDateAdapter } from "../../../../../../../shared-library/src/lib/adapters/custom-date-adapters";
import { DateInputMaskDirective } from "../../../../../../../shared-library/src/lib/directive/mask-date.directive";
import { MY_DATE_FORMATS } from "../../../../../../../shared-library/src/lib/models/date/custom-date-format";
import { ReimbursementHealthValidators } from "./validators/reimbursement.health.validator";

registerLocaleData(localeFr);

@Component({
  selector: "app-health-content-refund",
  standalone: true,
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: LOCALE_ID, useValue: "fr-FR" },
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    CustomSelectComponent,
    CommonModule,
    DateInputMaskDirective,
  ],
  templateUrl: "./health-content.component.html",
  styleUrl: "./health-content.component.scss",
})
export class HealthContentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly beneficiaryService = inject(BeneficiaryService);
  private readonly refundService = inject(MyRefundService);

  readonly maxMonthsAntiquityValue = 27;

  filterForm: FormGroup = this.fb.group(
    {
      beneficiary: [null],
      careType: [null],
      careDateFrom: [
        "",
        [
          ReimbursementHealthValidators.maxMonthsAntiquity(
            this.maxMonthsAntiquityValue
          ),
          ReimbursementHealthValidators.notFutureDate(),
        ],
      ],
      careDateTo: [
        "",
        [
          ReimbursementHealthValidators.maxMonthsAntiquity(
            this.maxMonthsAntiquityValue
          ),
          ReimbursementHealthValidators.notFutureDate(),
        ],
      ],
      reimbursementDateFrom: [
        "",
        [
          ReimbursementHealthValidators.maxMonthsAntiquity(
            this.maxMonthsAntiquityValue
          ),
          ReimbursementHealthValidators.notFutureDate(),
        ],
      ],
      reimbursementDateTo: [
        "",
        [
          ReimbursementHealthValidators.maxMonthsAntiquity(
            this.maxMonthsAntiquityValue
          ),
          ReimbursementHealthValidators.notFutureDate(),
        ],
      ],
    },
    {
      validators: [
        ReimbursementHealthValidators.requiredBothDates(
          "careDateFrom",
          "careDateTo"
        ),
        ReimbursementHealthValidators.requiredBothDates(
          "reimbursementDateFrom",
          "reimbursementDateTo"
        ),
        ReimbursementHealthValidators.dateRange(
          "reimbursementDateFrom",
          "reimbursementDateTo"
        ),
        ReimbursementHealthValidators.dateRange("careDateFrom", "careDateTo"),
      ],
    }
  );

  beneficiaries = [{ key: "", value: "Tous" }];
  careTypes: any[] = [];
  currentUser: any;

  @Output() searchElement = new EventEmitter<any>();

  ngOnInit(): void {
    this.loadConnectedUser();
  }

  private loadConnectedUser(): void {
    this.authService
      .getSessionConnectedUser()
      .pipe(
        tap(user => {
          if (!user) return;
          this.currentUser = user;
          const beneficiaryRequest = new BeneficiaryRequest();
          beneficiaryRequest.numParticipant = user.numeroParticipant;

          this.loadBeneficiaries(beneficiaryRequest);
          this.loadCareTypes();
        }),
        catchError(err => {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            err
          );
          return of(null);
        })
      )
      .subscribe();
  }

  private loadBeneficiaries(request: BeneficiaryRequest): void {
    this.beneficiaryService
      .getAllBeneficiaries(request)
      .pipe(
        map((result: any[] | null) => {
          const list = result ?? [];
          this.beneficiaries = [
            { key: "", value: "Tous" },
            ...list.map((b: any) => ({
              key: b.id,
              value: b.nomComplet,
            })),
          ];
        }),
        catchError(err => {
          console.error("Erreur lors du chargement des bénéficiaires :", err);
          return of([]);
        })
      )
      .subscribe();
  }

  private loadCareTypes(): void {
    this.refundService
      .getCareOrigin()
      .pipe(
        map((result: any[]) => {
          this.careTypes = result.map(soin => ({
            key: soin.familleLibelle,
            value: soin.familleLibelle,
          }));
        }),
        catchError(err => {
          console.error("Erreur lors du chargement des types de soins :", err);
          return of([]);
        })
      )
      .subscribe();
  }

  onSubmit(): void {
    this.searchElement.emit(this.filterForm.value);
  }

  checkValidation() {
    this.careDateError();
    this.reimbursementDateError();
  }

  readonly careDateError = () => {
    const from = this.filterForm.get("careDateFrom");
    const to = this.filterForm.get("careDateTo");

    // Priorité des erreurs
    if (from?.hasError("maxAntiquity") || to?.hasError("maxAntiquity")) {
      return "Antériorité maximale de 27 mois";
    }

    if (from?.hasError("futureDate") || to?.hasError("futureDate")) {
      return "Veuillez saisir une période valide";
    }

    if (this.filterForm.hasError("invalidRange")) {
      return "Votre recherche n'est pas valide";
    }
    if (this.filterForm.hasError("requiredBothDates")) {
      return "Votre recherche n'est pas valide";
    }

    return null;
  };

  readonly reimbursementDateError = () => {
    const from = this.filterForm.get("reimbursementDateFrom");
    const to = this.filterForm.get("reimbursementDateTo");

    if (from?.hasError("maxAntiquity") || to?.hasError("maxAntiquity")) {
      return "Antériorité maximale de 27 mois";
    }

    if (from?.hasError("futureDate") || to?.hasError("futureDate")) {
      return "Veuillez saisir une période valide";
    }

    if (
      this.filterForm.hasError("invalidRange") ||
      this.filterForm.hasError("requiredBothDates")
    ) {
      return "Votre recherche n'est pas valide";
    }

    return null;
  };
}
