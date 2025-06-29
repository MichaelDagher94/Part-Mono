import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "lib-custom-icons-btn",
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: "./custom-icons-btn.component.html",
  styleUrl: "./custom-icons-btn.component.scss",
})
export class CustomIconsBtnComponent {
  @Input() iconName!: string;
  @Input() tooltip: string = "";
  @Input() show: boolean = true;
  @Input()
  @Output()
  onBtnClick: EventEmitter<any> = new EventEmitter();

  handleClick() {
    this.onBtnClick.emit();
  }
}
