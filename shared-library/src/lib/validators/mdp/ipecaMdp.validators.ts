import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class IpecaMdpValidator {
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || "";

      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\\\/[\]~`]/.test(value);
      const hasMinLength = value.length >= 12;

      const valid = hasUpperCase && hasNumber && hasSpecialChar && hasMinLength;

      return valid
        ? null
        : {
            ipecaPassword: {
              hasUpperCase,
              hasNumber,
              hasSpecialChar,
              hasMinLength,
              message:
                "Votre mot de passe doit inclure au minimum 12 caractères, dont une majuscule, un chiffre et un caractère spécial.",
            },
          };
    };
  }
}
