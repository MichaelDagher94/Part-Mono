import { Component, inject, input, signal } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoaderFacadeService } from "./loader.facade.service";

@Component({
  selector: "lib-loader",
  imports: [MatProgressSpinnerModule],
  templateUrl: "./loader.component.html",
  styleUrl: "./loader.component.css",
})
export class LoaderComponent {
  loaderFacadeService = inject(LoaderFacadeService);
}
