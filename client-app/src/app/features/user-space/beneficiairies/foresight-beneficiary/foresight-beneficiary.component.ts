import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-foresight-beneficiary",
  imports: [CommonModule, MatListModule],
  templateUrl: "./foresight-beneficiary.component.html",
  styleUrl: "./foresight-beneficiary.component.scss",
})
export class ForesightBeneficiaryComponent {
  @Input() selectedItem: number = 2;
  @Output() onItemSelected: EventEmitter<any> = new EventEmitter();

  items = [
    { label: "Désignation bénéficiaire" },
    { label: "Choix option décès" },
  ];

  selectItem(index: number): void {
    this.selectedItem = index + 2;
    this.onItemSelected.emit(this.selectedItem);
  }
}
