import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from "@angular/forms";

export class SharedDateValidators {
  /**
   * Validator to check if a date is within a maximum number of months in the past.
   */
  static maxMonthsAntiquity(months: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const date = new Date(control.value);
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() - months);

      return date < maxDate ? { maxAntiquity: true } : null;
    };
  }

  /**
   * Validator to ensure the date is strictly in the future.
   */
  static futureDateOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const date = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      return date <= today ? { notFutureDate: true } : null;
    };
  }

  /**
   * Validator to ensure the date is not in the future.
   */
  static notFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const date = new Date(control.value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      return date > today ? { futureDate: true } : null;
    };
  }

  /**
   * Validator to ensure a valid date range between two fields in a FormGroup.
   */
  static dateRange(startField: string, endField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const start = formGroup.get(startField)?.value;
      const end = formGroup.get(endField)?.value;

      if (!start || !end) return null;

      return new Date(start) > new Date(end) ? { invalidRange: true } : null;
    };
  }

  /**
   * Validator to ensure both start and end dates are provided.
   */
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
