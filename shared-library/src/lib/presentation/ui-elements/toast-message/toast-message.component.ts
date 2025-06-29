import { Component, Inject, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarModule,
  MatSnackBarRef,
} from "@angular/material/snack-bar";

export type ToastType = "success" | "warning" | "danger" | "info";

export interface ToastData {
  title: string;
  message: string;
  type: ToastType;
}

@Component({
  selector: "lib-toast-message",
  imports: [MatSnackBarModule, MatIconModule, MatButtonModule],
  templateUrl: "./toast-message.component.html",
  styleUrl: "./toast-message.component.scss",
})
export class ToastMessageComponent {
  data = inject<ToastData>(MAT_SNACK_BAR_DATA);
  snackBarRef = inject(MatSnackBarRef<ToastMessageComponent>);

  getIcon(): string {
    switch (this.data.type) {
      case "success":
        return "check_circle";
      case "warning":
        return "warning";
      case "danger":
        return "error";
      case "info":
        return "info";
      default:
        return "notifications";
    }
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
