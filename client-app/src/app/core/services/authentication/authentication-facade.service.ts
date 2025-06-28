import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { LoginRequest } from "../../../../../../shared-library/src/lib/models/authentication/request/Auth/LoginRequest";
import { UserSession } from "../../../../../../shared-library/src/lib/models/session/UserSession";
import { AuthenticationService } from "../../../../../../shared-library/src/lib/services/authentication/authentication.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationFacadeService {
  //dependencies
  private authenticationService = inject(AuthenticationService);

  private userSessionSubject = new BehaviorSubject<UserSession | null>(null);
  public userSession$ = this.userSessionSubject.asObservable();

  public login(loginRequest: LoginRequest): Observable<UserSession> {
    return this.authenticationService.login(loginRequest).pipe(
      tap((userSession: UserSession) => {
        this.userSessionSubject.next(userSession);
        localStorage.setItem("session", JSON.stringify(userSession));
      })
    );
  }

  getConnectedUser(): Observable<any> {
    return this.authenticationService.getCurrentParticipant();
  }

  public logout(): void {
    this.authenticationService.logout();
  }

  public get currentSession(): UserSession | null {
    return this.userSessionSubject.value;
  }
}
