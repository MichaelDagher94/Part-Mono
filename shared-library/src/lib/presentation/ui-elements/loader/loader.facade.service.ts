import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoaderFacadeService {
  public isLoading = signal<boolean>(false);

  show() {
    this.isLoading.set(true);
  }

  hide() {
    this.isLoading.set(false);
  }
}
