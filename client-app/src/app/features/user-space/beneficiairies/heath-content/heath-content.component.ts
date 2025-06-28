import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { ParticipantFacadeService } from "../../../../core/services/participant-facade/participant-facade.service";

@Component({
  selector: "app-beneficiary-heath-content",
  imports: [CommonModule, MatListModule],
  templateUrl: "./heath-content.component.html",
  styleUrl: "./heath-content.component.scss",
})
export class HeathContentComponent {
  @Input() selectedItem: number = 0;
  @Output() onItemSelected: EventEmitter<any> = new EventEmitter();

  //dependencies
  participantFacade = inject(ParticipantFacadeService);

  //declarations
  currentParticipant = signal<any>(null);

  items = [
    { id: 0, label: "Liste des bénéficiaires" }, //0
    { id: 1, label: "Ajouter un bénéficiaire" }, //1
  ];

  ngOnInit(): void {
    this.participantFacade.getCurrentParticipant().subscribe(participant => {
      this.currentParticipant.set(participant);
      if (this.currentParticipant().multiRib == true) {
        this.items.push({ id: 4, label: "Gérer le multi RIB" });
      }
    });
  }

  selectItem(item: any): void {
    this.selectedItem = item.id;
    // if (index == 2) this.onItemSelected.emit(4);
    this.onItemSelected.emit(this.selectedItem);
  }
}
