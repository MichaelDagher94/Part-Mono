import { Component, computed, input } from "@angular/core";

@Component({
  selector: "app-beneficiary-info-banner",
  imports: [],
  templateUrl: "./beneficiary-info-banner.component.html",
  styleUrl: "./beneficiary-info-banner.component.scss",
})
export class BeneficiaryInfoBannerComponent {
  title = input<string>();
  filesToUpload = input<string[]>();
  hideIcon = input<boolean>(false);

  hasFilesToUpload = computed(() => {
    const files = this.filesToUpload();
    return files ? files.length > 0 : false;
  });
}
