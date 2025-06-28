import { inject, Injectable } from "@angular/core";
import { ParticipantService } from "../../../../../../../../shared-library/src/lib/services/participant/participant.service";

@Injectable({
  providedIn: "root",
})
export class ParticipantFacadeService {
  participantService = inject(ParticipantService);
  constructor() {}

  downloadThirdPartyPayings(data: any) {
    return this.participantService.GetThirdPartyPayingsByAffiliationFileAsync(
      data
    );
  }
}
