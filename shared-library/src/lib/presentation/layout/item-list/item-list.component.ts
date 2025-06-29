import { Component, input } from "@angular/core";

@Component({
  selector: "lib-item-list",
  imports: [],
  templateUrl: "./item-list.component.html",
  styleUrl: "./item-list.component.css",
})
export class ItemListComponent {
  itemkey = input.required<string>();
  itemValue = input.required<string>();
}
