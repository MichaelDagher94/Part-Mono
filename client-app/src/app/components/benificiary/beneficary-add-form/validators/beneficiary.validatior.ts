import { AbstractControl, ValidatorFn } from "@angular/forms";

export function requiredSelectionValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // Vérifie que la valeur n'est pas null, undefined, vide ou égale à 'noChoice'
    const isValid = control.value && control.value !== "noChoice";
    return isValid ? null : { required: true };
  };
}
