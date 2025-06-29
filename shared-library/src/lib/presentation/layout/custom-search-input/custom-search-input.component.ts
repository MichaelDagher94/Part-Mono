import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "lib-custom-search-input",
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRippleModule,
  ],
  templateUrl: "./custom-search-input.component.html",
  styleUrl: "./custom-search-input.component.scss",
})
export class CustomSearchInputComponent {
  searchForm = new FormGroup({
    searchTerm: new FormControl(""),
  });

  onSearch() {
    console.log(this.searchForm.value.searchTerm);
  }
}
