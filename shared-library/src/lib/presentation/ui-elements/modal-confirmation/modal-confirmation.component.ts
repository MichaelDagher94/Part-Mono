import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";

export interface ConfirmationModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: "lib-modal-confirmation",
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: "./modal-confirmation.component.html",
  styleUrl: "./modal-confirmation.component.scss",
})
export class ModalConfirmationComponent {
  dialogRef = inject(MatDialogRef<ModalConfirmationComponent>);
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    this.data = {
      confirmText: "Confirmer",
      cancelText: "Annuler",
      ...this.data,
    };
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
