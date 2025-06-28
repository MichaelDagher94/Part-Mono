import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { catchError, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import { ModalService } from "../../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FormScrollService } from "../../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { BeneficiaryCguComponent } from "../../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { ParticipantFacadeService } from "../../../../../../core/services/participant-facade/participant-facade.service";
import { emailMatchValidator } from "./validators/email-match.validator";
import { AutofocusDirective } from "../../../../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";

@Component({
  selector: "app-email-edit",
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    CommonModule,
    BeneficiaryCguComponent,
    AutofocusDirective,
  ],
  templateUrl: "./email-edit.component.html",
  styleUrl: "./email-edit.component.scss",
})
export class EmailEditComponent {
  emailMaxChar: number = 45;
  dataForm!: FormGroup;
  fb = inject(FormBuilder);
  formScroll = inject(FormScrollService);
  participantFacade = inject(ParticipantFacadeService);
  private readonly modalService = inject(ModalService);
  private toast = inject(ToastMessageService);

  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant().pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    ),
    { initialValue: null }
  );

  initializeForm() {
    this.dataForm = this.fb.group(
      {
        oldEmail: [
          this.currentParticipant().email,
          [Validators.required, Validators.email],
        ],
        email: ["", [Validators.required, Validators.email]],
        confirmEmail: ["", [Validators.required, Validators.email]],
      },
      {
        validators: emailMatchValidator("email", "confirmEmail"),
      }
    );
    this.dataForm.get("oldEmail")?.disable();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  getErrorMessage(controlName: string): string {
    const control = this.dataForm.get(controlName);

    if (
      !control ||
      !control.errors ||
      (!control.touched && !this.dataForm.touched)
    ) {
      return "";
    }

    if (control.hasError("required")) {
      return "Ce champ est obligatoire";
    }

    if (control.hasError("email")) {
      return "Format d'email invalide";
    }

    if (control.hasError("emailMismatch")) {
      return "Les emails ne correspondent pas";
    }

    return "Valeur invalide";
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.formScroll.scrollToFirstInvalidControl();
      return;
    }
    const modalData = {
      title: "Connexion et sécurité",
      message: `Êtes-vous sûr(e) de vouloir transmettre cette demande ?`,
      confirmText: "Oui",
      cancelText: "Non",
      confirmColor: "warn",
    };
    this.modalService.openConfirmationModal(modalData).subscribe(confirmed => {
      if (confirmed) this.validationConfirmed();
    });
  }

  private validationConfirmed() {
    const participant = this.currentParticipant();
    if (!participant) {
      this.toast.danger(
        "Erreur",
        "Impossible de récupérer les informations du participant."
      );
      return;
    }

    this.dataForm.get("oldEmail")?.enable();

    this.participantFacade
      .updateEmail({
        currentEmail: this.dataForm.get("oldEmail")?.value,
        newEmail: this.dataForm.get("email")?.value,
        participantNumber: participant.numeroParticipant,
        participant,
      })
      .pipe(
        take(1),
        switchMap((response: any) => {
          this.participantFacade
            .getCurrentParticipant(true)
            .pipe(take(1))
            .subscribe();
          if (response.isSuccess && response.source === "update") {
            this.toast.success(
              "Connexion et sécurité",
              "Votre adresse courriel a bien été modifiée.",
              3000,
              () => {
                location.reload();
              }
            );
            return of(null);
          }

          if (response.isSuccess && response.source === "check") {
            this.toast.warning(
              "Connexion et sécurité",
              "L'email que vous avez choisi est déjà utilisé par un autre compte. Veuillez sélectionner un autre"
            );
            return of(null);
          }

          this.toast.danger(
            "Connexion et sécurité",
            "Une erreur s'est produite. Veuillez réessayer plus tard"
          );
          return of(null);
        }),
        catchError(error => {
          this.toast.danger(
            "Connexion et sécurité",
            "Impossible de traiter la demande. Veuillez réessayer plus tard"
          );
          console.error(error);
          return of(null);
        })
      )
      .subscribe();
  }
}
