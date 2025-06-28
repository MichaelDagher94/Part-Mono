import { Component, inject, Input, output } from "@angular/core";
import { ParticipantFacadeService } from "../../../../core/services/participant-facade/participant-facade.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-foresight-journies",
  imports: [MatListModule, MatExpansionModule, MatIconModule],
  templateUrl: "./foresight-journies.component.html",
  styleUrl: "./foresight-journies.component.scss",
})
export class ForesightJourniesComponent {
  @Input() selectedItem = "0";
  onItemSelected = output<number>();

  //dependencies
  participantFacade = inject(ParticipantFacadeService);
  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant(),
    { initialValue: null }
  );

  items = [
    { id: "2", label: "Transmettre un justificatif", isExpanded: false },
    { id: "3", label: "Demande d'information", isExpanded: false },
  ];

  selectItem(item: any): void {
    if (!item.children) {
      this.selectedItem = item.id;
      this.onItemSelected.emit(item.id);
    }
  }

  toggleChildren(item: any): void {
    this.selectItem(item);
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    } else {
      this.selectedItem = item.id;
      this.onItemSelected.emit(item.id);
    }
  }

  selectChild(parent: any, child: any): void {
    this.selectedItem = child.id;
    this.onItemSelected.emit(child.id);
  }
}
