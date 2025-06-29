import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationModalData } from "../modal-confirmation.component";
import { ModalConfirmationComponent } from "../modal-confirmation.component";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  openConfirmationModal(data: ConfirmationModalData) {
    return this.dialog
      .open(ModalConfirmationComponent, {
        width: "450px",
        disableClose: true,
        data,
      })
      .afterClosed();
  }
}
