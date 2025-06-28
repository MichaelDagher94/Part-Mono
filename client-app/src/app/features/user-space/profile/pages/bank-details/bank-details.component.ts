import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ItemListComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/item-list/item-list.component";
import { map } from "rxjs";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-bank-details",
  imports: [ItemListComponent, MatIconModule, MatButtonModule],
  templateUrl: "./bank-details.component.html",
  styleUrl: "./bank-details.component.scss",
})
export class BankDetailsComponent {
  participantFacade = inject(ParticipantFacadeService);
  currentParticipant = signal<any>(null);
  router = inject(Router);

  ngOnInit(): void {
    this.participantFacade
      .getCurrentParticipant()
      .pipe(
        map(participant => ({
          ...participant,
          dateNaissance: new Date(
            participant.dateNaissance
          ).toLocaleDateString(),
        }))
      )
      .subscribe(participant => {
        this.currentParticipant.set(participant);
      });
  }

  handleEdit() {
    this.router.navigate(["mon-profil/coordonnées-bancaires/modification"]);
  }
}
