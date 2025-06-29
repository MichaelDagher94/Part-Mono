// shared-lib/src/lib/api-config.token.ts
import { InjectionToken } from '@angular/core';
import { EnvironmentConfig } from '../../interfaces/app-configuration/environment-config';

export const ENVIRONMENT_CONFIG_TOKEN = new InjectionToken<EnvironmentConfig>(
    'ENVIRONMENT_CONFIG'
  );
