import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FormScrollService {
  scrollToFirstInvalidControl(formSelector: string = "form .ng-invalid"): void {
    const firstInvalidControl = document.querySelector(
      formSelector
    ) as HTMLElement;

    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      firstInvalidControl.focus();
    }
  }
}
