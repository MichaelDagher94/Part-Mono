import { Component, EventEmitter, inject, Output, signal } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ParticipantFacadeService } from "../../../../../../client-app/src/app/core/services/participant-facade/participant-facade.service";

@Component({
  selector: "lib-custom-tabs",
  imports: [MatTabsModule],
  templateUrl: "./custom-tabs.component.html",
  styleUrl: "./custom-tabs.component.scss",
})
export class CustomTabsComponent {
  @Output() selectedTabChangeEvent: EventEmitter<void> = new EventEmitter();
  //dependencies
  participantFacade = inject(ParticipantFacadeService);
  currentParticipant = signal<any>(null);

  isHealthVisible = true;
  isBenefitVisible = true;

  ngOnInit(): void {
    this.participantFacade.getCurrentParticipant().subscribe(participant => {
      this.currentParticipant.set(participant);
      this.isHealthVisible = this.currentParticipant().isSante;
      this.isBenefitVisible = this.currentParticipant().isPrevoyance;
    });
  }

  selectedTabChange(value: any) {
    this.selectedTabChangeEvent.emit(value.index);
  }
}
