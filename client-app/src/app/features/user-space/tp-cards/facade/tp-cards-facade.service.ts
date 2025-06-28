import { inject, Injectable } from "@angular/core";
import { TpCardsService } from "../../../../../../../shared-library/src/lib/services/tp-cards/tp-cards.service";
import { catchError, of } from "rxjs";
import { ToastMessageService } from "../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";

@Injectable({
  providedIn: "root",
})
export class TpCardsFacadeService {
  tpCardsService = inject(TpCardsService);
  private readonly toast = inject(ToastMessageService);
  constructor() {}

  getListTiersPayant(participant: any) {
    const payload = {
      numParticipant: participant.numeroParticipant,
      attestation: participant.numAttestation,
      intParticipant: participant.id,
      emailSender: participant.email,
      envoiemail: "0",
      isSiteWeb: true,
      platform: "",
      browser: "",
      engine: "",
    };
    return this.tpCardsService.getAllTiersPayantList(payload).pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }
}
// {
//   "numParticipant": "0808196",
//   "attestation": "3653369",
//   "intParticipant": "0808196",
//   "emailSender": "testsevolis+int_0808196@gmail.com",
//   "envoiemail": "0",
//   "isSiteWeb": true,
//   "platform": "",
//   "browser": "",
//   "engine": ""
// }
