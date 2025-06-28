import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function emailMatchValidator(
  emailField: string,
  confirmEmailField: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const emailControl = formGroup.get(emailField);
    const confirmEmailControl = formGroup.get(confirmEmailField);

    if (!emailControl || !confirmEmailControl) {
      return null;
    }

    if (emailControl.value !== confirmEmailControl.value) {
      confirmEmailControl.setErrors({
        ...confirmEmailControl.errors,
        emailMismatch: true,
      });
      return { emailMismatch: true };
    } else {
      // Clear the mismatch error if emails match
      if (confirmEmailControl.errors?.["emailMismatch"]) {
        const { emailMismatch, ...errors } = confirmEmailControl.errors;
        confirmEmailControl.setErrors(
          Object.keys(errors).length ? errors : null
        );
      }
      return null;
    }
  };
}
