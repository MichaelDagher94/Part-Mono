import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function checkedValidatorRequired(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === true ? null : { required: true };
  };
}
