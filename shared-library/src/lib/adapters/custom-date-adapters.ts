import { Injectable } from "@angular/core";
import { MatDateFormats } from "@angular/material/core";
import { NativeDateAdapter } from "@angular/material/core";

export const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ["DD/MM/YYYY", "D/M/YYYY", "DD-MM-YYYY"],
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === "string") {
      const parts = value.split(/[\/-]/);
      if (parts.length === 3) {
        return new Date(+parts[2], +parts[1] - 1, +parts[0]);
      }
    }
    return super.parse(value);
  }
}
