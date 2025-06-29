import { Component, Input, output } from "@angular/core";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "lib-beneficiary-table-details",
  imports: [MatButton],
  templateUrl: "./beneficiary-table-details.component.html",
  styleUrl: "./beneficiary-table-details.component.scss",
})
export class BeneficiaryTableDetailsComponent {
  @Input() element: any;
  handleEdit = output();

  handleEditClick() {
    this.handleEdit.emit();
  }
}
