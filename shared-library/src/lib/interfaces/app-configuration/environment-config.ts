import { NgxLoggerLevel } from "ngx-logger";

export interface EnvironmentConfig {
  production: boolean;
  version: string;
  name: string;
  loggingConfig: {
    logLevel: NgxLoggerLevel;
    serverLogLevel: NgxLoggerLevel;
    serverLoggingUrl: string;
    timestampFormat: string;
  };
  ipecaApi: {
    baseUrlV1: string;
    baseUrlV2: string;
    auth: {
      login: string;
      refresh: string;
    };
    admin: {
      setInitTestUsers: string;
      getApplicationParameterAsync: string;
      setApplicationParameterAsync: string;
    };
    participant: {
      me: string;
      updateIban: string;
      ctrlIban: string;
      findtrtiban: string;
      quotesList: string;
      setpechospi: string;
      getcountries: string;
      updateBankInfo: string;
      updateemail: string;
      updateadress: string;
      updatephone: string;
      updatepassword: string;
      updateData: string;
      emailexist: string;
      allnotices: string;
      getnoticefile: string;
      GetDeathOptionChoiceFile: string;
      GetDeathBeneficiaryDesignation: string;
      getchoixcontratairbus: string;
      insertchoixcontratairbus: string;
      getAffiliationCertificate: string;
      getStatusReport: string;
      getContributionAppealFile: string;
      getConsentList: string;
      getConsentInfo: string;
      updateConsent: string;
    };
    remboursement: {
      remboursementssante: string;
      foresightRefund: string;
      careorigin: string;
      searchMultiCriteria: string;
      searchForeSightByDate: string;
      download: string;
      downloadv2: string;
    };
    beneficiary: {
      beneficiaries: string;
      addbeneficiary: string;
      addTempbeneficiary:string;
      editbeneficiary: string;
      deletebeneficiary: string;
      getThirdPartyPayingsByAffiliation:string;
    };
    eptica: {
      getCorrespondance: string;
      savedocuments: string;
      getmydocipeca: string;
    };
    tierspayant: {
      tierspayantlist: string;
      tierspayantdocument: string;
    };
    document: {
      getListeDocumentsPersonnalisees: string;
      getListePdfs: string;
    };
    offre: {
      getOffre: string;
      getListeOffres: string;
      getListeOffresPersonnalisees: string;
    };
  geolocalisation: {
      getTypePs: string;
      getTypePsHospital: string;
      getCities: string;
      getPosition: string;
      searchcodefinesse: string;
    };
    logs: {
      getAll: string;
      getFiltered: string;
    };
  };
  ipecaWebsite: {
    "admin-app": string;
    "client-app": string;
    "login-app": string;
  };
  role: string;
  useCookies:boolean;
}
