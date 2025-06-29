import { UserInfo }   from '../models/userInfo/UserInfo';
import { UserTokens } from '../models/userTokens/UserTokens';

export type AuthSessionBundle = { userInfo: UserInfo; userTokens: UserTokens };

export class CookieStore {
  private static readonly KEY = 'authSessionBundle';

  static write(data: AuthSessionBundle): void {
    document.cookie =
      this.KEY + '=' + encodeURIComponent(JSON.stringify(data)) + '; path=/; SameSite=Lax';
  }

  static read(): AuthSessionBundle | null {
    const m = document.cookie.match(new RegExp('(?:^|; )' + this.KEY + '=([^;]+)'));
    if (!m) return null;
    try { return JSON.parse(decodeURIComponent(m[1])); } catch { return null; }
  }

  static clear(): void {
    document.cookie = this.KEY + '=; path=/; max-age=0';
  }
}
