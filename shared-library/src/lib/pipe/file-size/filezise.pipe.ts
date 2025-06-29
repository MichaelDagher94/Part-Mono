import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fileSize",
})
export class FileSizePipe implements PipeTransform {
  transform(size: number, decimals: number = 1): string {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(decimals)} Mo`;
    } else {
      return `${(size / 1024).toFixed(decimals)} Ko`;
    }
  }
}
