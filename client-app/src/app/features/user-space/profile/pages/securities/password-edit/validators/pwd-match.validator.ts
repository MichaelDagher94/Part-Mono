import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function pwdMatchValidator(
  pwdField: string,
  confirmPwdField: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const pwdControl = formGroup.get(pwdField);
    const confirmPwdControl = formGroup.get(confirmPwdField);

    // Vérification des contrôles existants
    if (!pwdControl || !confirmPwdControl) {
      return null;
    }

    // Si les valeurs sont différentes
    if (pwdControl.value !== confirmPwdControl.value) {
      // Ajoute l'erreur pwdMismatch sans écraser les autres erreurs
      confirmPwdControl.setErrors({
        ...confirmPwdControl.errors,
        pwdMismatch: true,
      });
      return { pwdMismatch: true };
    } else {
      // Si les mots de passe correspondent
      if (confirmPwdControl.errors?.["pwdMismatch"]) {
        // Supprime uniquement l'erreur pwdMismatch en conservant les autres
        const { pwdMismatch, ...remainingErrors } = confirmPwdControl.errors;
        confirmPwdControl.setErrors(
          Object.keys(remainingErrors).length > 0 ? remainingErrors : null
        );
      }
      return null;
    }
  };
}
