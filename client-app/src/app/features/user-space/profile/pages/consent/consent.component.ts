import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { MatRadioModule } from "@angular/material/radio";
import { map } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
interface IpecaUpdateConsent {
  NumParticipant: string;
  IdConsentement: string;
  IdTypeReponse: string;
  Reponse: boolean;
}
@Component({
  selector: "app-consent",
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    MatRadioModule,
    MatButtonModule,
    BeneficiaryCguComponent,
  ],
  templateUrl: "./consent.component.html",
  styleUrl: "./consent.component.scss",
})
export class ConsentComponent {
  participantFacade = inject(ParticipantFacadeService);
  toast = inject(ToastMessageService);
  modalService = inject(ModalService);

  // declarations
  descTooltip = `Le RGPD, Règlement Général sur la Protection des Données, encadre le traitement légal des données personnelles dans l’Union Européenne.​`;
  consentResponseArray: IpecaUpdateConsent[] = [];
  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant(),
    { initialValue: null }
  );
  globalInfoBulleIndex = 0;

  resetInfoBulleIndex() {
    this.globalInfoBulleIndex = 0;
  }

  getAndIncrementInfoBulleIndex() {
    return this.globalInfoBulleIndex++;
  }
  customInfoBulleListe = [
    "Concerne les documents liés à la gestion de vos garanties, tels que les décomptes, la carte de tiers payant, les demandes de justificatifs, etc",
    "Informations émises par IPECA, relatives aux actualités et aux services en lien avec les garanties souscrites.",
    "Informations émises par les partenaires de IPECA, relatives aux actualités et aux services en lien avec les garanties souscrites.",
    "Propositions de produits / garanties commercialisées par IPECA",
  ];

  // Consent list grouped by type
  consentList = toSignal(
    this.participantFacade
      .getConsentList(this.currentParticipant().numeroParticipant)
      .pipe(
        map(consentList => {
          // Regrouper les consentements par type
          const grouped = consentList.reduce((grouped: any[], item: any) => {
            const existingGroup = grouped.find(
              group => group.type === item.type
            );
            if (existingGroup) {
              existingGroup.items.push(item);
            } else {
              grouped.push({ type: item.type, items: [item] });
            }
            return grouped;
          }, []);

          // Initialiser consentResponseArray
          this.consentResponseArray = consentList.map((item: any) => ({
            NumParticipant: this.currentParticipant().numeroParticipant,
            IdConsentement: item.iD_Consentement,
            IdTypeReponse: null,
            response: false,
          }));

          return grouped;
        })
      ),
    { initialValue: [] }
  );

  onRadioChange(event: any, el: any): void {
    const selectedValue = event.value; // ID de la réponse sélectionnée
    console.log(
      `Selected value for consentement "${el.iD_Consentement}":`,
      selectedValue
    );

    // Mettre à jour consentResponseArray
    const consentIndex = this.consentResponseArray.findIndex(
      consent => consent.IdConsentement === el.iD_Consentement
    );

    if (consentIndex !== -1) {
      this.consentResponseArray[consentIndex].IdTypeReponse = selectedValue;
      this.consentResponseArray[consentIndex].Reponse = selectedValue === 3;
    }
  }

  submit() {
    const modalData = {
      title: "CONFIRMATION",
      message: ` Etes-vous sûr(e) de vouloir modifier vos consentements ?`,
      confirmText: "OUI",
      cancelText: "NON",
    };

    this.modalService
      .openConfirmationModal(modalData)
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.confirmSubmit();
        }
      });
  }

  confirmSubmit() {
    this.participantFacade
      .updateConsentParticipant(this.consentResponseArray)
      .subscribe({
        next: response => {
          this.participantFacade.getCurrentParticipant(true);
          if (response) {
            this.toast.success(
              "Succès",
              "Vos préférences ont bien été enregistrées."
            );
          } else {
            this.toast.danger(
              "Erreur",
              "Une erreur est survenue lors de l’enregistrement de votre demande. Nous vous invitons à la renouveler ultérieurement"
            );
          }
        },
        error: error => {
          this.toast.danger(
            "Erreur",
            "Une erreur est survenue lors de l’enregistrement de votre demande. Nous vous invitons à la renouveler ultérieurement"
          );
        },
      });
  }
}
