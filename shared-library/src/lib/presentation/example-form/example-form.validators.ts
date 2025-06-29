// custom-validators.ts
import { AbstractControl } from '@angular/forms';

export function equalValues(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordNotEqual: true };
}
