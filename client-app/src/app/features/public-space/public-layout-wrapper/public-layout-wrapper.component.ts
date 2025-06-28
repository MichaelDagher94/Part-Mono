import { Component } from "@angular/core";
import { PreHeaderComponent } from "../../../../../../shared-library/src/lib/presentation/layout/client/pre-header/pre-header.component";
import { FooterComponent } from "../../../../../../shared-library/src/lib/presentation/layout/footer/footer.component";
import { LoaderComponent } from "../../../../../../shared-library/src/lib/presentation/ui-elements/loader/loader.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-public-layout-wrapper",
  imports: [RouterOutlet, PreHeaderComponent, FooterComponent, LoaderComponent],
  templateUrl: "./public-layout-wrapper.component.html",
  styleUrl: "./public-layout-wrapper.component.scss",
})
export class PublicLayoutWrapperComponent {}
