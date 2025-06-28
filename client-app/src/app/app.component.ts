import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { BreadcrumbComponent } from "xng-breadcrumb";
import { PreHeaderComponent } from "../../../shared-library/src/lib/presentation/layout/client/pre-header/pre-header.component";
import { FooterComponent } from "../../../shared-library/src/lib/presentation/layout/footer/footer.component";
import { MenuBannerComponent } from "../../../shared-library/src/lib/presentation/layout/menu-banner/menu-banner.component";
import { HeaderComponent } from "../../../shared-library/src/lib/presentation/layout/client/header/header.component";

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {}
