import { Component, inject } from "@angular/core";
import { CustomButtonComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/custom-button/custom-button.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { BeneficiaryFacadeService } from "../../facades/beneficiary-facade.service";
import { FileDownloadService } from "../../../../../../../../shared-library/src/lib/services/download/file-download.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";

@Component({
  selector: "app-death-option-choice",
  imports: [CustomButtonComponent],
  templateUrl: "./death-option-choice.component.html",
  styleUrl: "./death-option-choice.component.scss",
})
export class DeathOptionChoiceComponent {
  beneficiaryFacade = inject(BeneficiaryFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  downloadService = inject(FileDownloadService);
  toast = inject(ToastMessageService);

  currentParticpant = toSignal(this.participantFacade.getCurrentParticipant(), {
    initialValue: null,
  });

  download() {
    this.beneficiaryFacade
      .downloadDeathOptionChoiceFile(this.currentParticpant())
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.downloadService.downloadPdf(
              response?.data?.pdf,
              response?.data?.nom
            );
          }
        },
        error: error => {
          this.toast.danger(
            "Erreur",
            "Erreur lors du téléchargement du fichier " + error
          );
        },
      });
  }
}
