import { Component, inject, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { FirstLoginModalFacadeService } from "./facade/first-login-modal-facade.service";

interface IModalData {
  formColor?: string;
  formOpacity?: string;
  htmlBody?: string;
  htmlHeader?: string;
  id?: string;
  type?: number;
}

@Component({
  selector: "app-first-login-modal",
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: "./first-login-modal.component.html",
  styleUrl: "./first-login-modal.component.scss",
})
export class FirstLoginModalComponent {
  dontShowAgain = false;

  firstLoginFacade = inject(FirstLoginModalFacadeService);

  constructor(
    private dialogRef: MatDialogRef<FirstLoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: IModalData | null
  ) {}

  get hasData(): boolean {
    return !!(
      this.modalData &&
      (this.modalData.htmlHeader || this.modalData.htmlBody)
    );
  }

  onOkClick() {
    if (this.modalData?.id) {
      this.firstLoginFacade
        .setNotificationAsRead(this.modalData?.id, this.dontShowAgain)
        .subscribe({
          next: response => {
            console.log("Notification updated successfully", response);
          },
          error: error => {
            console.error("Error updating notification", error);
          },
        });
    }
    this.dialogRef.close();
  }
}
