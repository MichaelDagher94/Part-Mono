import { inject, Injectable } from "@angular/core";
import { ParticipantService } from "../../../../../../shared-library/src/lib/services/participant/participant.service";
import { switchMap, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LayoutFacadeService {
  participantService = inject(ParticipantService);

  constructor() {}
  /**
   * Retrieves the current participant from the ParticipantService.
   * If no participant is found, it attempts to fetch the participant using a stored session token.
   * @returns An observable of the current participant or null if not found.
   */
  getCurrentParticipant() {
    return this.participantService.getCurrentParticipant().pipe(
      switchMap(participant => {
        if (participant) {
          return of(participant);
        }
        const sessionStr = localStorage.getItem("session");
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session && session.token) {
            return this.participantService.Me(session.token).pipe(
              tap(newParticipant => {
                this.participantService.setCurrentParticipant(newParticipant);
              }),
              switchMap(newParticipant => of(newParticipant))
            );
          }
        }
        return of(null);
      })
    );
  }
}
