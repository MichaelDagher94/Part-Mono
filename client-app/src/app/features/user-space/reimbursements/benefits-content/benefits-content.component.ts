import {
  Component,
  EventEmitter,
  inject,
  LOCALE_ID,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

import { ReimbursementHealthValidators } from "../health-content/validators/reimbursement.health.validator";
import { MY_DATE_FORMATS } from "../../../../../../../shared-library/src/lib/models/date/custom-date-format";
import { CustomDateAdapter } from "../../../../../../../shared-library/src/lib/adapters/custom-date-adapters";
import { DateInputMaskDirective } from "../../../../../../../shared-library/src/lib/directive/mask-date.directive";

@Component({
  selector: "app-benefits-content-refund",
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
    DateInputMaskDirective,
  ],
  templateUrl: "./benefits-content.component.html",
  styleUrl: "./benefits-content.component.scss",
})
export class BenefitsContentComponent {
  private readonly fb = inject(FormBuilder);
  readonly maxMonthsAntiquityValue = 27;
  @Output() searchElement: EventEmitter<any> = new EventEmitter();

  filterForm: FormGroup = this.fb.group(
    {
      payoutDateFrom: [
        "",
        [
          ReimbursementHealthValidators.maxMonthsAntiquity(
            this.maxMonthsAntiquityValue
          ),
          ReimbursementHealthValidators.notFutureDate(),
        ],
      ],
      payoutDateTo: [
        "",
        [
          ReimbursementHealthValidators.maxMonthsAntiquity(
            this.maxMonthsAntiquityValue
          ),
          ReimbursementHealthValidators.notFutureDate(),
        ],
      ],
      compensationDateFrom: [
        "",
        [
          ReimbursementHealthValidators.maxMonthsAntiquity(
            this.maxMonthsAntiquityValue
          ),
          ReimbursementHealthValidators.notFutureDate(),
        ],
      ],
      compensationDateTo: [
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
          "payoutDateFrom",
          "payoutDateTo"
        ),
        ReimbursementHealthValidators.dateRange(
          "payoutDateFrom",
          "payoutDateTo"
        ),
        ReimbursementHealthValidators.requiredBothDates(
          "compensationDateFrom",
          "compensationDateTo"
        ),
        ReimbursementHealthValidators.dateRange(
          "compensationDateFrom",
          "compensationDateTo"
        ),
      ],
    }
  );

  onSubmit() {
    this.searchElement.emit(this.filterForm.value);
  }

  checkValidation() {
    this.filterForm.updateValueAndValidity();
  }

  readonly payoutError = () => {
    const from = this.filterForm.get("payoutDateFrom");
    const to = this.filterForm.get("payoutDateTo");

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

  readonly compensationDateError = () => {
    const from = this.filterForm.get("compensationDateFrom");
    const to = this.filterForm.get("compensationDateTo");

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
