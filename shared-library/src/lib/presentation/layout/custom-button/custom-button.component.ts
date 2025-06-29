import { CommonModule } from "@angular/common";
import { Component, EventEmitter, input, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

type sizeType = "small" | "medium" | "large";
@Component({
  selector: "lib-custom-button",
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: "./custom-button.component.html",
  styleUrl: "./custom-button.component.scss",
})
export class CustomButtonComponent {
  @Input({ required: true }) text!: string;
  @Input() showIcon: boolean = false;
  @Input() icon: string = "person";
  size = input<sizeType>("medium");

  @Output() onClick: EventEmitter<void> = new EventEmitter();

  handleClick() {
    this.onClick.emit();
  }
}
