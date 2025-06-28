import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-guarantees-foresight-content",
  imports: [CommonModule, MatListModule],
  templateUrl: "./guarantees-foresight-content.component.html",
  styleUrl: "./guarantees-foresight-content.component.scss",
})
export class GuaranteesForesightContentComponent {
  selectedItem = "2";

  onItemSelected = output<any>();

  items = [
    { id: "2", label: "Mes notices prévoyance" },
    { id: "3", label: "Compléter ma couverture prévoyance" },
  ];

  selectItem(index: string): void {
    this.selectedItem = index;
    this.onItemSelected.emit(index);
  }
}
