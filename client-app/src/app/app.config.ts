// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

import { EnvironmentConfig } from "../../../shared-library/src/lib/interfaces/app-configuration/environment-config";
import { ENVIRONMENT_CONFIG_TOKEN } from "../../../shared-library/src/lib/configuration/env-configuration-token";
import { environment } from "../environments/environment";
import { TokenInterceptor } from "../../../shared-library/src/lib/interceptors/requests/token-interceptor/token.interceptor";
import { routes } from "./app.routes";
import { LoadingInterceptor } from "../../../shared-library/src/lib/interceptors/requests/loading-interceptor/loading-interceptor.service";
import { provideNgxMask } from "ngx-mask";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { HttpErrorInterceptor } from "../../../shared-library/src/lib/interceptors/requests/http-error/http-error.interceptor";

const appEnvironment: EnvironmentConfig = {
  production: environment.production,
  version: environment.version,
  name: environment.name,
  loggingConfig: {
    logLevel: environment.loggingConfig.logLevel,
    serverLogLevel: environment.loggingConfig.serverLogLevel,
    serverLoggingUrl: environment.loggingConfig.serverLoggingUrl,
    timestampFormat: environment.loggingConfig.timestampFormat,
  },
  ipecaApi: {
    baseUrlV1: environment.ipecaApi.baseUrlV1,
    baseUrlV2: environment.ipecaApi.baseUrlV2,
    auth: {
      login: environment.ipecaApi.auth.login,
      refresh: environment.ipecaApi.auth.refresh,
    },
    admin: {
      setInitTestUsers: environment.ipecaApi.admin.setInitTestUsers,
      getApplicationParameterAsync:
        environment.ipecaApi.admin.getApplicationParameterAsync,
      setApplicationParameterAsync:
        environment.ipecaApi.admin.setApplicationParameterAsync,
    },
    participant: {
      me: environment.ipecaApi.participant.me,
      updateIban: environment.ipecaApi.participant.updateIban,
      ctrlIban: environment.ipecaApi.participant.ctrlIban,
      findtrtiban: environment.ipecaApi.participant.findtrtiban,
      quotesList: environment.ipecaApi.participant.quotesList,
      setpechospi: environment.ipecaApi.participant.setpechospi,
      getcountries: environment.ipecaApi.participant.getcountries,
      updateBankInfo: environment.ipecaApi.participant.updateBankInfo,
      updateemail: environment.ipecaApi.participant.updateemail,
      updateadress: environment.ipecaApi.participant.updateadress,
      updatephone: environment.ipecaApi.participant.updatephone,
      updatepassword: environment.ipecaApi.participant.updatepassword,
      updateData: environment.ipecaApi.participant.updateData,
      emailexist: environment.ipecaApi.participant.emailexist,
      allnotices: environment.ipecaApi.participant.allnotices,
      getnoticefile: environment.ipecaApi.participant.getnoticefile,
      GetDeathOptionChoiceFile:
        environment.ipecaApi.participant.GetDeathOptionChoiceFile,
      GetDeathBeneficiaryDesignation:
        environment.ipecaApi.participant.GetDeathBeneficiaryDesignation,
      getchoixcontratairbus:
        environment.ipecaApi.participant.getchoixcontratairbus,
      insertchoixcontratairbus:
        environment.ipecaApi.participant.insertchoixcontratairbus,
      getAffiliationCertificate:
        environment.ipecaApi.participant.getAffiliationCertificate,
      getStatusReport: environment.ipecaApi.participant.getStatusReport,
      getContributionAppealFile:
        environment.ipecaApi.participant.getContributionAppealFile,
      getConsentList: environment.ipecaApi.participant.getConsentList,
      getConsentInfo: environment.ipecaApi.participant.getConsentInfo,
      updateConsent: environment.ipecaApi.participant.updateConsent,
    },
    remboursement: {
      remboursementssante:
        environment.ipecaApi.remboursement.remboursementssante,
      foresightRefund: environment.ipecaApi.remboursement.foresightRefund,
      careorigin: environment.ipecaApi.remboursement.careorigin,
      searchMultiCriteria:
        environment.ipecaApi.remboursement.searchMultiCriteria,
      searchForeSightByDate:
        environment.ipecaApi.remboursement.searchForeSightByDate,
      download: environment.ipecaApi.remboursement.download,
      downloadv2: environment.ipecaApi.remboursement.downloadv2,
    },
    beneficiary: {
      beneficiaries: environment.ipecaApi.beneficiary.beneficiaries,
      addbeneficiary: environment.ipecaApi.beneficiary.addbeneficiary,
      addTempbeneficiary: environment.ipecaApi.beneficiary.addTempbeneficiary,
      editbeneficiary: environment.ipecaApi.beneficiary.editbeneficiary,
      deletebeneficiary: environment.ipecaApi.beneficiary.deletebeneficiary,
      getThirdPartyPayingsByAffiliation:
        environment.ipecaApi.beneficiary.getThirdPartyPayingsByAffiliation,
    },
    eptica: {
      getCorrespondance: environment.ipecaApi.eptica.getCorrespondance,
      savedocuments: environment.ipecaApi.eptica.savedocuments,
      getmydocipeca: environment.ipecaApi.eptica.getmydocipeca,
    },
    tierspayant: {
      tierspayantlist: environment.ipecaApi.tierspayant.tierspayantlist,
      tierspayantdocument: environment.ipecaApi.tierspayant.tierspayantdocument,
    },
    document: {
      getListeDocumentsPersonnalisees:
        environment.ipecaApi.document.getListeDocumentsPersonnalisees,
      getListePdfs: environment.ipecaApi.document.getListePdfs,
    },
    offre: {
      getOffre: environment.ipecaApi.offre.getOffre,
      getListeOffres: environment.ipecaApi.offre.getListeOffres,
      getListeOffresPersonnalisees:
        environment.ipecaApi.offre.getListeOffresPersonnalisees,
    },
    geolocalisation: {
      getTypePs: environment.ipecaApi.geolocalisation.getTypePs,
      getTypePsHospital: environment.ipecaApi.geolocalisation.getTypePsHospital,
      getCities: environment.ipecaApi.geolocalisation.getCities,
      getPosition: environment.ipecaApi.geolocalisation.getPosition,
      searchcodefinesse: environment.ipecaApi.geolocalisation.searchcodefinesse,
    },
    notification: {
      getListeNotificationPersonnalisees:
        environment.ipecaApi.notification.getListeNotificationPersonnalisees,
      getListeNotificationDashboard:
        environment.ipecaApi.notification.getListeNotificationDashboard,
      getListeNotificationImage:
        environment.ipecaApi.notification.getListeNotificationImage,
      setNotificationEntry:
        environment.ipecaApi.notification.setNotificationEntry,
    },
    logs: {
      getAll: environment.ipecaApi.logs.getAll,
      getFiltered: environment.ipecaApi.logs.getFiltered,
    },
  },
  ipecaWebsite: {
    "admin-app": environment.ipecaWebsite["admin-app"],
    "client-app": environment.ipecaWebsite["client-app"],
    "login-app": environment.ipecaWebsite["login-app"],
  },
  role: "user",
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxMask(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: ENVIRONMENT_CONFIG_TOKEN, useValue: appEnvironment },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    // {
    //   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    //   useValue: {
    //     subscriptSizing: "dynamic",
    //   },
    // },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
};
