import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function franceSocialSecurityValidator(
  genderControlName: string,
  birthDateControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const ssn: string = control.value;
    if (!ssn || ssn.length !== 15 || !/^\d{15}$/.test(ssn)) {
      return null; // Laisse les autres validators gérer le format de base
    }

    const formGroup = control.parent;
    if (!formGroup) {
      return null;
    }

    const gender = formGroup.get(genderControlName)?.value ?? "";
    const birthDate = formGroup.get(birthDateControlName)?.value ?? "";

    if (gender == null || !birthDate) {
      return {
        franceSSN: {
          message:
            "Le genre et la date de naissance sont requis pour valider le NIR.",
        },
      };
    }

    // Vérification du 1er chiffre (genre)
    const expectedFirstDigit = gender === 1 ? "1" : gender === 0 ? "2" : "";
    if (ssn[0] !== expectedFirstDigit) {
      return {
        franceSSN: { message: "Le premier chiffre du NIR est invalide." },
      };
    }

    // Vérification de la date
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      return null;
    }

    const year = date.getFullYear().toString().slice(-2); // ex: "99"
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // "01" à "12"

    if (ssn.slice(1, 3) !== year) {
      return {
        franceSSN: { message: "L'année de naissance ne correspond pas." },
      };
    }

    if (ssn.slice(3, 5) !== month) {
      return {
        franceSSN: { message: "Le mois de naissance ne correspond pas." },
      };
    }

    // ✅ Vérification de la clé de contrôle
    const number13Digits = ssn.slice(0, 13);
    const key = parseInt(ssn.slice(13), 10);
    const expectedKey = 97 - (parseInt(number13Digits, 10) % 97);

    if (key !== expectedKey) {
      return {
        franceSSN: { message: "La clé du NIR est invalide." },
      };
    }

    return null;
  };
}
