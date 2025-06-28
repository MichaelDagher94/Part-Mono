import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
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
import { BeneficiaryCguComponent } from "../../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormScrollService } from "../../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { ParticipantFacadeService } from "../../../../../../core/services/participant-facade/participant-facade.service";
import { pwdMatchValidator } from "./validators/pwd-match.validator";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ToastMessageService } from "../../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { catchError, of } from "rxjs";
import { IpecaMdpValidator } from "../../../../../../../../../shared-library/src/lib/validators/mdp/ipecaMdp.validators";
import { ModalService } from "../../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { AutofocusDirective } from "../../../../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";

@Component({
  selector: "app-password-edit",
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    CommonModule,
    MatTooltipModule,
    BeneficiaryCguComponent,
    AutofocusDirective,
  ],
  templateUrl: "./password-edit.component.html",
  styleUrl: "./password-edit.component.scss",
})
export class PasswordEditComponent {
  dataForm!: FormGroup;
  fb = inject(FormBuilder);
  formScroll = inject(FormScrollService);
  participantFacade = inject(ParticipantFacadeService);
  private toast = inject(ToastMessageService);
  private readonly modalService = inject(ModalService);

  currentParticipant = toSignal(
    this.participantFacade.getCurrentParticipant().pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    ),
    { initialValue: null }
  );
  info =
    "Votre mot de passe doit inclure au minimum 12 caractères dont une majuscule, un chiffre et un caractère spécial (!#$%&()+,-.<=>[]^_{}£*)";

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideNewConfirmPassword = true;

  initializeForm() {
    this.dataForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required]],
        newPassword: [
          "",
          [Validators.required, IpecaMdpValidator.strongPassword()],
        ],
        confirmNewPassword: ["", [Validators.required]],
      },
      {
        validators: pwdMatchValidator("newPassword", "confirmNewPassword"),
      }
    );
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

    if (control.hasError("ipecaPassword")) {
      return control.getError("ipecaPassword").message;
    }

    if (control.hasError("required")) {
      return "Ce champ est obligatoire";
    }

    if (control.hasError("email")) {
      return "Format d'email invalide";
    }

    if (control.hasError("pwdMismatch")) {
      return "Les mots de passe ne correspondent pas";
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
    this.participantFacade
      .updatePassword({
        NumParticipant: this.currentParticipant().numeroParticipant,
        OldPassword: this.dataForm.get("currentPassword")?.value,
        Password: this.dataForm.get("newPassword")?.value,
        participant: this.currentParticipant(),
      })
      .subscribe({
        next: value => {
          this.toast.success(
            "Connexion et sécurité",
            "Votre mot de passe a bien été modifié.",
            3000,
            () => {
              location.reload();
            }
          );
        },
        error: err => {
          console.log(err);
          this.toast.danger("Connexion et sécurité", err, 3000, () => {
            location.reload();
          });
        },
      });
  }
}
