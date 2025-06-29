import { InjectionToken } from "@angular/core";
import { IAuthenticationFacadeService } from "../../interfaces/authentication/iauthentication-facade.service";

export const AUTHENTICATION_FACADE_CONFIGURATION_TOKEN = new InjectionToken<IAuthenticationFacadeService>('AUTH_SERVICE');
