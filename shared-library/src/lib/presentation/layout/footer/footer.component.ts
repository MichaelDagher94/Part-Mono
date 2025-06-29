import { Component } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: "lib-footer",
  imports: [MatToolbarModule, MatIconModule],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
})
export class FooterComponent {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    // this.iconRegistry.addSvgIcon(
    //   'linkedin',
    //   this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/linkedin.svg')
    // );
    // this.iconRegistry.addSvgIcon(
    //   'youtube',
    //   this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/youtube.svg')
    // );
  }
}
