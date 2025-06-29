import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[dateInputMask]",
  standalone: true,
})
export class DateInputMaskDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener("input", ["$event"])
  onInput(event: InputEvent): void {
    const input = this.el.nativeElement;
    let value = input.value;

    // Enlever tout sauf les chiffres
    value = value.replace(/\D/g, "");

    // Appliquer le format jj/MM/aaaa
    if (value.length > 4) {
      value =
        value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
    } else if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    input.value = value;
  }

  @HostListener("blur")
  onBlur(): void {
    const value = this.el.nativeElement.value;
    const isValid = /^\d{2}\/\d{2}\/\d{4}$/.test(value);
    this.el.nativeElement.setCustomValidity(
      isValid ? "" : "Date invalide. Format attendu : jj/mm/aaaa"
    );
  }
}
