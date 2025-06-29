import { Component, Input, forwardRef } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "lib-custom-select",
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: "./custom-select.component.html",
  styleUrl: "./custom-select.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor {
  @Input() label: string = ""; // Le label à afficher
  @Input() options: { key: string; value: string }[] = []; // Liste des options

  value: any = null;
  isDisabled: boolean = false;

  // Fonctions de callback Angular
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  // Obligatoire : permet de MAJ la valeur interne du champ quand Angular le demande
  writeValue(value: any): void {
    this.value = value;
  }

  // Obligatoire : permet à Angular de capter un changement de valeur
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Obligatoire : permet à Angular de savoir si le champ a été touché
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Obligatoire (optionnel dans l'interface mais essentiel pour le désactiver)
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Quand l'utilisateur sélectionne une valeur
  onSelectChange(value: any): void {
    this.value = value;
    this.onChange(value); // avertir Angular de la nouvelle valeur
    this.onTouched(); // marquer comme "touché"
  }
}
