import { Component, output } from "@angular/core";
import { CustomButtonComponent } from "../../custom-button/custom-button.component";

@Component({
  selector: "lib-client-header",
  imports: [CustomButtonComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  logoPath: string = "assets/shared-library/logo-ipeca.svg";
  onLogout = output<any>();
  onLogoClick = output<any>();

  constructor() {}

  handleLogoClick() {
    this.onLogoClick.emit("");
  }

  disconnect() {
    this.onLogout.emit("");
  }
}
