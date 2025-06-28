import { Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-beneficiary-cgu",
  imports: [MatButtonModule],
  templateUrl: "./beneficiary-cgu.component.html",
  styleUrl: "./beneficiary-cgu.component.scss",
})
export class BeneficiaryCguComponent {
  email: string = "dpd@ipeca-msae.fr";

  type = input<any>("default");
}
