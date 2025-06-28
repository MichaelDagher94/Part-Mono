import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { ItemListComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/item-list/item-list.component";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";

@Component({
  selector: "app-personnal-data",
  imports: [ItemListComponent, MatIconModule, MatButtonModule],
  templateUrl: "./personnal-data.component.html",
  styleUrl: "./personnal-data.component.scss",
})
export class PersonnalDataComponent {
  participantFacade = inject(ParticipantFacadeService);
  router = inject(Router);
  currentParticipant = signal<any>(null);

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
    this.router.navigate(["mon-profil/modification-donnees-personnelles"]);
  }
}
