import { Component, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "lib-banner-information",
  imports: [MatIconModule],
  templateUrl: "./banner-information.component.html",
  styleUrl: "./banner-information.component.css",
})
export class BannerInformationComponent {
  bannerText = input<string>();
}
