import { Component } from "@angular/core";
import { CustomSearchInputComponent } from "../../custom-search-input/custom-search-input.component";
import { environment } from "../../../../../../../client-app/src/environments/environment";

@Component({
  selector: "lib-pre-header",
  imports: [CustomSearchInputComponent],
  templateUrl: "./pre-header.component.html",
  styleUrl: "./pre-header.component.scss",
})
export class PreHeaderComponent {
  menuList = [
    { menu: `${environment.name.substring(0, 3).toUpperCase()}.`, path: "#" },
    { menu: "V2.7.0.0", path: "#" },
    // { menu: " FRD841D01DBW  IPECA.EVOLIS.INT", path: "#" },
    { menu: "Foire aux questions", path: "#" },
  ];
}
