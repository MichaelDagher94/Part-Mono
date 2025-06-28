import { Component, effect, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ToastMessageService } from "../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { ParticipantFacadeService } from "../../../core/services/participant-facade/participant-facade.service";
import { BeneficiaryFacadeService } from "./facade/beneficiary-facade/beneficiary-facade.service";
import { map } from "rxjs";
import {
  checkDownloadEligibility,
  SSNPatternApply,
} from "../beneficiairies/services/beneficiaries.web.service";
import { CustomTableComponent } from "../../../../../../shared-library/src/lib/presentation/layout/custom-table/custom-table.component";
import { FileDownloadService } from "../../../../../../shared-library/src/lib/services/download/file-download.service";

@Component({
  selector: "app-tp-cards",
  imports: [CustomTableComponent],
  templateUrl: "./tp-cards.component.html",
  styleUrl: "./tp-cards.component.scss",
})
export class TpCardsComponent {
  private readonly beneficiaryFacadeService = inject(BeneficiaryFacadeService);
  participantFacadeService = inject(ParticipantFacadeService);
  private readonly downloadService = inject(FileDownloadService);

  private router = inject(Router);
  private toast = inject(ToastMessageService);
  currentParticipant = toSignal(
    this.participantFacadeService.getCurrentParticipant(),
    { initialValue: null }
  );

  tierPayantList = toSignal(
    this.beneficiaryFacadeService
      .getAllBeneficiaries(this.currentParticipant().numeroParticipant)
      .pipe(
        map(beneficiaries =>
          beneficiaries?.map((beneficiary: any) => ({
            ...beneficiary,
            genre: beneficiary.genre === 1 ? "Masculin" : "Féminin",
            numeroSecuriteSociale: SSNPatternApply(
              beneficiary.numeroSecuriteSociale
            ),
            numeroSecuriteSociale2: SSNPatternApply(
              beneficiary.numeroSecuriteSociale2
            ),
            canDownload: this.checkDownload(beneficiary),
          }))
        )
      ),
    {
      initialValue: [],
    }
  );

  constructor() {
    effect(() => {
      if (
        this.currentParticipant().numAttestationFuture ||
        this.currentParticipant().debutCarteTpFuture
      ) {
        this.displayFutureTpCard();
      }
    });
  }
  displayFutureTpCard() {
    this.columns.push("debutCarteTpFuture");
  }

  // tierPayantList = toSignal(
  //   this.participantFacadeService.getAllTpList(this.createPayload()).pipe(
  //     map(beneficiaries =>
  //       beneficiaries?.map((beneficiary: any) => ({
  //         ...beneficiary,
  //         genre: beneficiary.genre === 1 ? "Masculin" : "Féminin",
  //         numeroSecuriteSociale: SSNPatternApply(
  //           beneficiary.numeroSecuriteSociale
  //         ),
  //         numeroSecuriteSociale2: SSNPatternApply(
  //           beneficiary.numeroSecuriteSociale2
  //         ),
  //         canDownload: this.checkDownload(beneficiary),
  //       }))
  //     )
  //   ),
  //   {
  //     initialValue: [],
  //   }
  // );

  readonly columns = [
    "nomComplet",
    "dateDeNaissance",
    "dateAffiliation",
    "genre",
    "numeroSecuriteSociale",
  ];

  readonly columnTitles: Record<string, string> = {
    nomComplet: "Prénom Nom",
    dateDeNaissance: "Date de Naissance",
    dateAffiliation: "Affilié(e) depuis le",
    genre: "genre",
    numeroSecuriteSociale: "Numéro de sécurité sociale",
    debutCarteTpFuture: "CARTE TP ANNEE A VENIR",
    download: "Carte TP",
  };

  private checkDownload(row: any): boolean {
    return row.numAttestation ? true : false;
  }

  createPayload() {
    return {
      numParticipant: this.currentParticipant().numeroParticipant,
      attestation: this.currentParticipant().numAttestation,
      intParticipant: this.currentParticipant().id,
      emailSender: this.currentParticipant().email,
      envoiemail: "0",
      isSiteWeb: true,
      platform: "",
      browser: "",
      engine: "",
    };
  }

  handleDownload(item: any) {
    // const payload = {
    //   participantNumber: item.numeroParticipant,
    //   certificateNumber: item.numAttestation,
    //   participantId: item.id,
    //   emailParticipant: item.email,
    //   ENVOIEMAIL: "0",
    // };
    const payload = {
      numParticipant: item.numeroParticipant,
      attestation: item.numAttestation,
      intParticipant: item.id,
      emailSender: item.email,
      envoiemail: "0",
      isSiteWeb: true,
      platform: "",
      browser: "",
      engine: "",
    };
    this.participantFacadeService.downloadThirdPartyPayings(payload).subscribe({
      next: res => {
        if (res) {
          this.downloadService.downloadPdf(res.data.pdf, res.data.nom);
        }
      },
      error: err => {
        console.warn(err);
        this.toast.danger(
          "Erreur",
          "Une erreur est survenue lors de l’enregistrement de votre demande. Nous vous invitons à la renouveler ultérieurement"
        );
      },
    });
  }
}
