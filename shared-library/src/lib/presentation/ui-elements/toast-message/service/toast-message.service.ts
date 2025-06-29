// toast.service.ts
import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  ToastMessageComponent,
  ToastData,
  ToastType,
} from "../toast-message.component";

@Injectable({ providedIn: "root" })
export class ToastMessageService {
  private defaultDuration = 10000; // milliseconds
  private snackBar = inject(MatSnackBar);

  private open(
    data: ToastData,
    duration = this.defaultDuration,
    onDismiss?: () => void
  ): void {
    const snackBarRef = this.snackBar.openFromComponent(ToastMessageComponent, {
      data,
      duration,
      panelClass: [`toast-${data.type}`], // Pour stylisation globale si nécessaire
      horizontalPosition: "right",
      verticalPosition: "top",
    });
    if (onDismiss) {
      snackBarRef.afterDismissed().subscribe(() => {
        onDismiss();
      });
    }
  }

  success(
    title: string,
    message: string,
    duration?: number,
    onDismiss?: () => void
  ): void {
    this.open({ title, message, type: "success" }, duration, onDismiss);
  }

  warning(
    title: string,
    message: string,
    duration?: number,
    onDismiss?: () => void
  ): void {
    this.open({ title, message, type: "warning" }, duration, onDismiss);
  }

  danger(
    title: string,
    message: string,
    duration?: number,
    onDismiss?: () => void
  ): void {
    this.open({ title, message, type: "danger" }, duration, onDismiss);
  }

  info(
    title: string,
    message: string,
    duration?: number,
    onDismiss?: () => void
  ): void {
    this.open({ title, message, type: "info" }, duration, onDismiss);
  }
}
