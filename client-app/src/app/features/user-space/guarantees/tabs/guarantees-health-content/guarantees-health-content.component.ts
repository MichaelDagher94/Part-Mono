import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-guarantees-health-content",
  imports: [CommonModule, MatListModule],
  templateUrl: "./guarantees-health-content.component.html",
  styleUrl: "./guarantees-health-content.component.scss",
})
export class GuaranteesHealthContentComponent {
  selectedItem = "0";
  onItemSelected = output<any>();

  participantFacade = inject(ParticipantFacadeService);
  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant(),
    { initialValue: null }
  );

  ngOnInit(): void {
    console.log(this.currentParticipant());
    if (this.currentParticipant().isAirbus) this.addfamilyContribution();
  }

  items = [
    { id: "0", label: "Mes notices" },
    { id: "1", label: "Compléter ma couverture santé" },
  ];

  addfamilyContribution() {
    this.items.splice(1, 0, { id: "4", label: "Ma cotisation famille" });
  }

  selectItem(index: string): void {
    this.selectedItem = index;
    this.onItemSelected.emit(index);
  }
}
