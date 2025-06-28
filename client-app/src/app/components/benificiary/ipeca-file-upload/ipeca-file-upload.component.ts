import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, input, Output } from "@angular/core";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { FileUploadService } from "../../../../../../shared-library/src/lib/services/file-upload/file-upload.service";
import { TruncateFileNamePipe } from "../../../../../../shared-library/src/lib/pipe/truncate-file-name.pipe";
import { ToastMessageService } from "../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FileSizePipe } from "../../../../../../shared-library/src/lib/pipe/file-size/filezise.pipe";
import { MatTooltipModule } from "@angular/material/tooltip";

interface UploadableFile {
  file: File;
  progress: number; // de 0 à 100
  status: "pending" | "uploading" | "done" | "error";
}

@Component({
  selector: "app-ipeca-file-upload",
  imports: [
    MatListModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatIconButton,
    TruncateFileNamePipe,
    FileSizePipe,
    MatTooltipModule,
  ],
  templateUrl: "./ipeca-file-upload.component.html",
  styleUrl: "./ipeca-file-upload.component.scss",
})
export class IpecaFileUploadComponent {
  isDragOver = false;
  selectedFiles: File[] = [];
  title = input("Pièce(s) jointe(s) *");
  sectionName = input.required<string>();
  tooltipMessage = input<string>();
  @Output() filesChanged = new EventEmitter<File[]>();

  fileUploadService = inject(FileUploadService);
  toast = inject(ToastMessageService);

  uploadingFiles: UploadableFile[] = [];

  readonly ACCEPTED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/tiff",
    "image/png",
    "image/gif",
    "image/bmp",
  ];

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  handleFiles(fileList: FileList): void {
    const acceptedFormats = ["pdf", "jpeg", "jpg", "tiff", "png", "gif", "bmp"];
    const maxTotalSize = 10 * 1024 * 1024; // 10 MB

    const newFiles: File[] = [];

    // On part de la taille déjà sélectionnée
    let currentTotalSize = this.selectedFiles.reduce(
      (sum, file) => sum + file.size,
      0
    );

    Array.from(fileList).forEach(file => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isValidExt = acceptedFormats.includes(ext!);

      if (!isValidExt) {
        console.warn(`❌ Format non accepté : ${file.name}`);
        return;
      }

      // Vérifie si le nouveau fichier va dépasser la limite
      if (currentTotalSize + file.size > maxTotalSize) {
        console.warn(`❌ Taille totale dépassée avec : ${file.name}`);
        this.toast.danger(
          "Téléversement de fichier",
          "Taille maximale autorisée dépassée (10 Mo)"
        );
        return;
      }

      newFiles.push(file);
      currentTotalSize += file.size;
    });

    if (newFiles.length > 0) {
      this.fileUploadService.putFiles(this.sectionName(), newFiles);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.filesChanged.emit(this.selectedFiles);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.filesChanged.emit(this.selectedFiles);
  }

  clearFiles(): void {
    this.selectedFiles = [];
    this.filesChanged.emit(this.selectedFiles);
  }
}
