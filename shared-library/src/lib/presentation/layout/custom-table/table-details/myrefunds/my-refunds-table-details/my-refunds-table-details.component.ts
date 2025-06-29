import { CommonModule } from "@angular/common";
import { Component, input, Input } from "@angular/core";

type refundType = "health" | "foresight";
@Component({
  selector: "lib-my-refunds-table-details",
  imports: [CommonModule],
  templateUrl: "./my-refunds-table-details.component.html",
  styleUrl: "./my-refunds-table-details.component.scss",
})
export class MyRefundsTableDetailsComponent {
  @Input() detailColumn: string = "";
  @Input() element: any;
  refundType = input<refundType>("health");
}
