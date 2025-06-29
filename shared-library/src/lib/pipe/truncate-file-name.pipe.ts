import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "truncateFileName",
})
export class TruncateFileNamePipe implements PipeTransform {
  transform(fullName: string, maxLength: number = 25): string {
    if (!fullName || fullName.length <= maxLength) return fullName;

    const lastDot = fullName.lastIndexOf(".");
    const extension = lastDot !== -1 ? fullName.substring(lastDot) : "";
    const baseName = fullName.substring(0, lastDot);

    const keepStart = Math.min(10, Math.floor(maxLength / 2));
    const keepEnd = Math.min(5, Math.floor(maxLength / 3));

    if (baseName.length > keepStart + keepEnd) {
      return (
        baseName.substring(0, keepStart) +
        "..." +
        baseName.substring(baseName.length - keepEnd) +
        extension
      );
    }

    return baseName + extension;
  }
}
