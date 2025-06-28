import { Component, inject } from "@angular/core";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { CustomButtonComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/custom-button/custom-button.component";
import { MatButtonModule } from "@angular/material/button";
import { FileDownloadService } from "../../../../../../../../shared-library/src/lib/services/download/file-download.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { Router } from "@angular/router";
import { MyDocumentsFacadeService } from "../../facade/my-documents-facade.service";
import { map } from "rxjs";

@Component({
  selector: "app-my-documents",
  imports: [MatButtonModule],
  templateUrl: "./my-documents.component.html",
  styleUrl: "./my-documents.component.scss",
})
export class MyDocumentsComponent {
  participantFacade = inject(ParticipantFacadeService);
  downloadService = inject(FileDownloadService);
  mydocumentFacadeService = inject(MyDocumentsFacadeService);
  toast = inject(ToastMessageService);
  router = inject(Router);

  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant(),
    {
      initialValue: null,
    }
  );
  hasCertificate = toSignal(this.participantFacade.hasCertificate(), {
    initialValue: false,
  });
  isHealth = toSignal(this.participantFacade.isSante(), {
    initialValue: false,
  });
  hasPaymentSchedule = toSignal(this.participantFacade.hasPaymentSchedule(), {
    initialValue: false,
  });
  IsDocumentAttestationSurLHonneur = toSignal(
    this.mydocumentFacadeService
      .getListCustomDocs({
        NumAdherent: this.currentParticipant().codeAdherent,
        NumEtablissement: this.currentParticipant().codeEtablissement,
        Age: this.currentParticipant().ageActuel + "",
        Population: this.currentParticipant().population,
        type: "AttestionEnfantACharge",
        echeancier: true,
      })
      .pipe(
        map(response => {
          return response.data.length > 0 ? true : false;
        })
      ),
    { initialValue: false }
  );
  honorDeclarationLink: string =
    "/assets/shared-library/pdf/Attestation%20sur%20l'honneur%20enfant%20à%20charge-Version%20finale.pdf";

  // declaration
  docAccessLabel = "accéder aux documents";
  downloadDocumentLabel = "Télécharger le document";

  carteTPDownload() {
    console.log("Downloading 'Ma carte de tiers payant'...");
    this.router.navigate(["/mes-cartes-tp"]);
  }

  downloadSituationReport() {
    console.log("Downloading 'Relevé de situation'...");
    // Logic for downloading "Relevé de situation"
    this.participantFacade
      .downloadStatusReport(this.currentParticipant().numeroParticipant)
      .subscribe({
        next: response => {
          this.downloadService.downloadPdf(response.pdf, response.nom);
        },
        error: error => {
          console.error("Error downloading carte de tiers payant", error);
          this.toast.danger(
            "Erreur",
            "Erreur lors du téléchargement de votre relevé de situation"
          );
        },
      });
  }

  downloadAffiliationCertificate() {
    console.log("Downloading 'Mon attestation d'affiliation'...");
    // Logic for downloading "Mon attestation d'affiliation"

    this.participantFacade
      .downloadCertificate(this.currentParticipant().numeroParticipant)
      .subscribe({
        next: response => {
          this.downloadService.downloadPdf(response.pdf, response.nom);
        },
        error: error => {
          console.error("Error downloading carte de tiers payant", error);
          this.toast.danger("Erreur", "Erreur lors du téléchargement");
        },
      });
  }

  downloadHonorDeclaration() {
    console.log(
      "Downloading 'Attestation sur l'honneur relative aux enfants à charge'...",
      this.IsDocumentAttestationSurLHonneur()
    );
    // Logic for downloading "Attestation sur l'honneur relative aux enfants à charge"
    window.open(this.honorDeclarationLink, "_blank");
  }

  downloadPaymentSchedule() {
    console.log("Downloading 'Appel cotisation'...");
    // Logic for downloading "Appel cotisation"

    this.participantFacade
      .downloadContributionAppealFile(
        this.currentParticipant().numeroParticipant
      )
      .subscribe({
        next: response => {
          this.downloadService.downloadPdf(response.pdf, response.nom);
        },
        error: error => {
          console.error("Error downloading carte de tiers payant", error);
          this.toast.danger("Erreur", "Erreur lors du téléchargement");
        },
      });
  }
}
