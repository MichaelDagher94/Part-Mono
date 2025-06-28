import { Component, inject, signal } from "@angular/core";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { catchError, map, of } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";

@Component({
  selector: "app-securities",
  imports: [MatIconModule, MatButtonModule],
  templateUrl: "./securities.component.html",
  styleUrl: "./securities.component.scss",
})
export class SecuritiesComponent {
  router = inject(Router);
  participantFacade = inject(ParticipantFacadeService);
  currentParticipant = signal<any>(null);
  private readonly toast = inject(ToastMessageService);

  ngOnInit(): void {
    this.participantFacade
      .getCurrentParticipant()
      .pipe(
        map(participant => ({
          ...participant,
          dateNaissance: new Date(
            participant.dateNaissance
          ).toLocaleDateString(),
        })),
        catchError(err => {
          this.toast.danger("Erreur", "Impossible de charger les données");
          return of([]);
        })
      )
      .subscribe(participant => {
        this.currentParticipant.set(participant);
      });
  }

  handleEditEmail() {
    this.router.navigate([
      "mon-profil/connexion-et-sécurite/email/modification",
    ]);
  }
  handleEditPassword() {
    this.router.navigate([
      "mon-profil/connexion-et-sécurite/motdepasse/modification",
    ]);
  }
}
