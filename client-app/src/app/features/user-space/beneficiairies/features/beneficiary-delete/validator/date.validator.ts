// date.validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function notFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Ne pas valider si le champ est vide (laisser Required s'en charger)
    }

    const selectedDate = new Date(control.value);
    const today = new Date();

    // Réinitialiser les heures pour comparer seulement les dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate > today ? { futureDate: true } : null;
  };
}
