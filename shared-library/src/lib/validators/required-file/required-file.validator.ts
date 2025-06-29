import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Validator to ensure a file or list of files is present.
 * Supports null, empty array, or FileList cases.
 */
export function requiredFileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0) ||
      (value instanceof FileList && value.length === 0)
    ) {
      return { requiredFile: true };
    }

    return null;
  };
}
