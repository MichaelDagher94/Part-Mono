import { Component, effect, inject } from "@angular/core";
import { ParticipantFacadeService } from "../../core/services/participant-facade/participant-facade.service";
import { FirstLoginModalComponent } from "./first-login-modal/first-login-modal.component";
import { FirstLoginModalFacadeService } from "./first-login-modal/facade/first-login-modal-facade.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";
import { DashboardQuickAccessComponent } from "../../../../../shared-library/src/lib/components/dashboard-quick-access/dashboard-quick-access.component";
import { DashboardBannerAutopromoComponent } from "../../../../../shared-library/src/lib/components/dashboard-banner-autopromo/dashboard-banner-autopromo.component";
import { DashboardClaimSectionComponent } from "../../../../../shared-library/src/lib/components/dashboard-claim-section/dashboard-claim-section.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";

@Component({
  selector: "app-user-space",
  imports: [
    DashboardQuickAccessComponent,
    DashboardBannerAutopromoComponent,
    DashboardClaimSectionComponent,
    UserDashboardComponent,
  ],
  templateUrl: "./user-space.component.html",
  styleUrl: "./user-space.component.scss",
})
export class UserSpaceComponent {
  firstLoginModalFacadeService = inject(FirstLoginModalFacadeService);
  private dialog: MatDialog = inject(MatDialog);

  currentParticipant = toSignal(
    this.firstLoginModalFacadeService.getCurrentParticipant(),
    {
      initialValue: null,
    }
  );

  dashboardNotificationsList = toSignal(
    this.firstLoginModalFacadeService
      .getDashboardNotifications({
        numAdherent: this.currentParticipant()?.codeAdherent,
        numEtablissement: this.currentParticipant()?.codeEtablissement,
        age: this.currentParticipant()?.ageActuel,
        population: this.currentParticipant()?.population,
        devicePlatform: "Navigator",
      })
      .pipe(map(response => response.data)),
    {
      initialValue: [],
    }
  );

  private dialogOpened = false;

  constructor() {
    effect(() => {
      const notifications = this.dashboardNotificationsList();
      if (
        !this.dialogOpened &&
        notifications &&
        notifications.length > 0 &&
        notifications[0]?.htmlHeader
      ) {
        const mynotif = notifications[0];
        this.dialog.open(FirstLoginModalComponent, {
          data: {
            formColor: mynotif.formColor,
            formOpacity: mynotif.formOpacity,
            htmlBody: mynotif.htmlBody,
            htmlHeader: mynotif.htmlHeader,
            id: mynotif.id,
            type: mynotif.type,
          },
          disableClose: true,
        });
        this.dialogOpened = true;
      }
    });
  }

  displayQuickAccess(): boolean {
    const participant = this.currentParticipant();
    return participant && participant.couvertureSante;
  }
}
