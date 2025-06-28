import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { MatTooltipModule } from "@angular/material/tooltip";
import { map } from "rxjs";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FileDownloadService } from "../../../../../../../../shared-library/src/lib/services/download/file-download.service";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { GuaranteeFacadeService } from "../../facade/guarantee-facade.service";

@Component({
  selector: "app-guarantees-notice-foresight",
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    MatRadioModule,
    MatButtonModule,
  ],
  templateUrl: "./guarantees-notice-foresight.component.html",
  styleUrl: "./guarantees-notice-foresight.component.scss",
})
export class GuaranteesNoticeForesightComponent {
  // dependencies
  guaranteeFacede = inject(GuaranteeFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  toast = inject(ToastMessageService);
  downloadService = inject(FileDownloadService);

  // declarations
  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant(),
    { initialValue: null }
  );
  noticeList = toSignal(
    this.guaranteeFacede.getAllNotices(this.currentParticipant().id).pipe(
      map((notices: any) => {
        // Filtrer les éléments avec risque "Prévoyance"
        const filteredNotices = notices.filter(
          (notice: any) => notice.risque === "Prévoyance"
        );

        // Regrouper par codeRegroupement
        const groupedNotices: { [key: string]: any[] } = filteredNotices.reduce(
          (grouped: { [key: string]: any[] }, notice: any) => {
            const group = grouped[notice.codeRegroupement] || [];
            group.push(notice);
            grouped[notice.codeRegroupement] = group;
            return grouped;
          },
          {}
        );

        // Transformer en tableau pour l'affichage
        return Object.entries(groupedNotices).map(
          ([codeRegroupement, items]: [string, any[]]) => ({
            codeRegroupement,
            items,
          })
        );
      })
    ),
    { initialValue: [] }
  );

  download(event: any) {
    this.guaranteeFacede
      .getNoticeFile(event.referencePdf, this.currentParticipant())
      .subscribe({
        next: (response: any) => {
          console.log("response", response);
          if (response) {
            this.downloadService.downloadPdf(response.Pdf, response.Nom);
          }
        },
        error: (error: any) => {
          this.toast.danger(
            "Erreur",
            "Erreur lors du téléchargement du fichier"
          );
        },
      });
  }
}
