import {
  Component,
  inject,
  Input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
} from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { ParticipantFacadeService } from "../../../../core/services/participant-facade/participant-facade.service";

@Component({
  selector: "app-health-journies",
  imports: [MatListModule, MatExpansionModule, MatIconModule],
  templateUrl: "./health-journies.component.html",
  styleUrl: "./health-journies.component.scss",
})
export class HealthJourniesComponent implements OnChanges {
  @Input() selectedItem = "1-1";
  onItemSelected = output<number>();

  //dependencies
  participantFacade = inject(ParticipantFacadeService);

  //declarations
  currentParticipant = signal<any>(null);

  items = [
    { id: "0", label: "Consulter mes devis", isExpanded: false },
    {
      id: "1",
      label: "Faire une demande",
      isExpanded: true,
      children: [
        { id: "1-1", label: "Prise en charge hospitalière" },
        { id: "1-2", label: "Devis" },
        { id: "1-3", label: "Remboursement" },
        { id: "1-4", label: "Autres questions" },
      ],
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedItem"]) {
      this.updateExpandedState();
    }
  }

  private updateExpandedState(): void {
    this.items.forEach(item => {
      if (item.children) {
        item.isExpanded = item.children.some(
          child => child.id === this.selectedItem
        );
      }
    });
  }

  selectItem(item: any): void {
    if (!item.children) {
      this.selectedItem = item.id;
      this.onItemSelected.emit(item.id);
    }
  }

  toggleChildren(item: any): void {
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
