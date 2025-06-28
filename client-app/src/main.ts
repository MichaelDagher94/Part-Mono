import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

function storeSessionFromQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const encodedSession = params.get("sessionData");

  if (encodedSession) {
    try {
      const decodedString = atob(decodeURIComponent(encodedSession));
      const userSession = JSON.parse(decodedString);
      localStorage.setItem("session", JSON.stringify(userSession));
    } catch (error) {
      console.error("Error decoding session data:", error);
    }
  }
}

storeSessionFromQueryParams();

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
