import { inject, Injectable } from "@angular/core";
import { NotificationService } from "../../../../../../../shared-library/src/lib/services/notifications/notification.service";
import { ParticipantService } from "../../../../../../../shared-library/src/lib/services/participant/participant.service";
import { of, switchMap, tap } from "rxjs";

interface INotificationEntry {
  notificationId: string;
  entryValue: boolean;
}
@Injectable({
  providedIn: "root",
})
export class FirstLoginModalFacadeService {
  notificationService = inject(NotificationService);
  participantService = inject(ParticipantService);

  constructor() {}

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

  getDashboardNotifications(data: any) {
    return this.notificationService.getListeNotificationDashboard(data);
  }

  setNotificationAsRead(id: string, choice: boolean) {
    const payload: INotificationEntry = {
      notificationId: id,
      entryValue: choice,
    };
    return this.notificationService.setNotificationEntry(payload);
  }
}
