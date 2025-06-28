import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class ReimbursementHealthValidators {
  static maxMonthsAntiquity(months: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const date = new Date(control.value);
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() - months);

      return date < maxDate ? { maxAntiquity: true } : null;
    };
  }

  static notFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const date = new Date(control.value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      return date > today ? { futureDate: true } : null;
    };
  }

  static dateRange(startField: string, endField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const start = formGroup.get(startField)?.value;
      const end = formGroup.get(endField)?.value;

      if (!start || !end) return null;

      return new Date(start) > new Date(end) ? { invalidRange: true } : null;
    };
  }

  static requiredBothDates(startField: string, endField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const start = formGroup.get(startField)?.value;
      const end = formGroup.get(endField)?.value;

      return (!start && end) || (start && !end)
        ? { requiredBothDates: { message: "Les deux dates sont obligatoires" } }
        : null;
    };
  }
}
