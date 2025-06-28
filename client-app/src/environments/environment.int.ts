import { NgxLoggerLevel } from "ngx-logger";
const appVersion = require("../../../../package.json").version;
const base = "https://integration.ipeca.fr/";
const baseUrl = "https://integration.myipeca-api.ipeca.fr/api/";
const baseUrlV1 = "https://integration.myipeca-api.ipeca.fr/api/v1/";
const baseUrlV2 = "https://integration.myipeca-api.ipeca.fr/api/v2/";
const basePath = "https://integration.ipeca.fr/ng/";
export const environment = {
  production: false,
  version: appVersion,
  name: "Integration",
  loggingConfig: {
    logLevel: NgxLoggerLevel.INFO,
    serverLogLevel: NgxLoggerLevel.ERROR,
    serverLoggingUrl: "https://example.com/api/logs",
    timestampFormat: "short",
  },
  ipecaApi: {
    baseUrlV1,
    baseUrlV2,
    auth: {
      login: `${baseUrlV1}auth/login`,
      refresh: `${baseUrlV1}token/refresh`,
    },
    admin: {
      setInitTestUsers: `${baseUrlV1}admin/setinittestusers`,
      getApplicationParameterAsync: `${baseUrlV1}admin/getapplicationparameterasync`,
      setApplicationParameterAsync: `${baseUrlV1}admin/setapplicationparameterasync`,
    },
    participant: {
      me: `${baseUrlV1}participant/me`,
      updateIban: `${baseUrlV1}Participant/updateiban`,
      ctrlIban: `${baseUrlV1}participant/ctrliban`,
      findtrtiban: `${baseUrlV1}participant/findtrtiban`,
      quotesList: `${baseUrlV1}Participant/getlistedevisparticipant`,
      setpechospi: `${baseUrlV1}Participant/setpechospi`,
      getcountries: `${baseUrlV1}Participant/getpays`,
      updateBankInfo: `${baseUrlV1}Participant/updatebankinfos`,
      updateemail: `${baseUrlV1}Participant/updateparticipantmail`,
      updateadress: `${baseUrlV1}Participant/updateaddress`,
      updatephone: `${baseUrlV1}Participant/updatephone`,
      updatepassword: `${baseUrlV1}Participant/updatepasswordparticipant`,
      updateData: `${baseUrlV1}Participant/updatecoordonneeparticipant`,
      emailexist: `${baseUrlV1}Participant/checkifmailexist`,
      allnotices: `${baseUrlV1}Participant/listenoticessanteprevoyance`,
      getnoticefile: `${baseUrlV1}Participant/getnotices`,
      GetDeathOptionChoiceFile: `${baseUrlV1}Participant/getchoixoptiondeces`,
      GetDeathBeneficiaryDesignation: `${baseUrlV1}Participant/getdesignationbeneficiairedeces`,
      getchoixcontratairbus: `${baseUrlV1}Participant/getchoixcontratairbus`,
      insertchoixcontratairbus: `${baseUrlV1}Participant/insertchoixcontratairbus`,
      getAffiliationCertificate: `${baseUrlV1}Participant/getattestationaffiliation`,
      getStatusReport: `${baseUrlV1}Participant/getrelevesituation`,
      getContributionAppealFile: `${baseUrlV1}Participant/getdocumentappelcotisation`,
      getConsentList: `${baseUrlV1}Participant/getlisteconsentementsparticipant`,
      getConsentInfo: `${baseUrlV1}Participant/getlisteconsentements`,
      updateConsent: `${baseUrlV1}Participant/updateconsentementparticipant`,
    },
    remboursement: {
      remboursementssante: `${baseUrlV1}Remboursement/remboursementssante`,
      foresightRefund: `${baseUrlV1}Remboursement/remboursementsprevoyance`,
      careorigin: `${baseUrlV1}Remboursement/getnaturesoin`,
      searchMultiCriteria: `${baseUrlV1}Remboursement/remboursementmulticritere`,
      searchForeSightByDate: `${baseUrlV1}Remboursement/getremboursementsprevoyancebydate`,
      download: `${baseUrlV1}Remboursement/decomptedocument`,
      downloadv2: `${baseUrlV1}participant/getdocument`,
    },
    beneficiary: {
      beneficiaries: `${baseUrlV1}Beneficiaire/beneficiaires`,
      addbeneficiary: `${baseUrlV1}Beneficiaire/addbeneficiaire`,
      addTempbeneficiary: `${baseUrlV1}Beneficiaire/addTempbeneficiaire`,
      editbeneficiary: `${baseUrlV1}Beneficiaire/updatebeneficiaire`,
      deletebeneficiary: `${baseUrlV1}Beneficiaire/deletebeneficiaire`,
      getThirdPartyPayingsByAffiliation: `${baseUrlV1}tierspayant/tierspayantdocument`,
    },
    eptica: {
      getCorrespondance: `${baseUrl}Eptica/getdoccorrespondance`,
      savedocuments: `${baseUrl}Eptica/savedocuments`,
      getmydocipeca: `${baseUrl}Eptica/getmydocipeca`,
    },
    tierspayant: {
      tierspayantlist: `${baseUrlV1}TiersPayant/tierspayantlist`,
      tierspayantdocument: `${baseUrlV1}TiersPayant/tierspayantdocument`,
    },
    document: {
      getListeDocumentsPersonnalisees: `${baseUrlV1}Document/getListeDocumentsPersonnalisees`,
      getListePdfs: `${baseUrlV1}Document/getListePdfs`,
    },
    offre: {
      getOffre: `${baseUrlV1}Offre/getOffre`,
      getListeOffres: `${baseUrlV1}Offre/getListeOffres`,
      getListeOffresPersonnalisees: `${baseUrlV1}Offre/getListeOffresPersonnalisees`,
    },
    geolocalisation: {
      getTypePs: `${baseUrlV1}geolocalisation/gettypeps`,
      getTypePsHospital: `${baseUrlV1}geolocalisation/gettypepshopitaux`,
      getCities: `${baseUrlV1}geolocalisation/getlistedesvilles`,
      getPosition: `${baseUrlV1}geolocalisation/getposition`,
      searchcodefinesse: `${baseUrlV1}geolocalisation/searchcodefinesse`,
    },
    notification: {
      getListeNotificationPersonnalisees: `${baseUrlV1}Notification/getListeNotificationsPersonnalisees`,
      getListeNotificationDashboard: `${baseUrlV1}Notification/getListeNotificationsDashboard`,
      getListeNotificationImage: `${baseUrlV1}Notification/getListeNotificationsImage`,
      setNotificationEntry: `${baseUrlV1}Notification/setNotificationEntry`,
    },
    actualite: {
      listeActualite: `${baseUrlV1}Actualite/actualite`,
      mentionLegale: `${baseUrlV1}Actualite/mentionlegales`,
      conditionsGenerales: `${baseUrlV1}Actualite/conditionsgenerales`,
      textinfo: `${baseUrlV1}Actualite/textinfo`,
      getTrancheAge: `${baseUrlV1}Actualite/gettrancheage`,
    },
    logs: {
      getAll: `${baseUrlV2}logs/all`,
      getFiltered: `${baseUrlV2}logsforboys`,
    },
  },
  ipecaWebsite: {
    "admin-app": `${basePath}admin`,
    "client-app": `${basePath}client`,
    "login-app": `${basePath}login`,
  },
  role: "user",
};
