import { Observable } from 'rxjs';
import { LoginRequest } from 'core.shared/Typescript/DTO/V1/Auth/LoginRequest';
import { UserInfo } from '../../models/userInfo/UserInfo';

export interface IAuthenticationFacadeService {
  userInfo$: Observable<UserInfo | null>;
  isAuthenticated$: Observable<boolean>;
  loading$: Observable<boolean>;
  error$: Observable<any | null>;

  login(loginRequest: LoginRequest): Observable<void>;
  refresh(): Observable<void>;
  logout(): Observable<void>;

  getCurrentUserInfo(): UserInfo | null;
  getCurrentUserRole(): string | null;
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  isAuthenticatedSync(): boolean;
}