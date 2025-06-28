import { inject, Injectable } from "@angular/core";
import { ParticipantService } from "../../../../../../../shared-library/src/lib/services/participant/participant.service";
import { catchError, map, Observable, of } from "rxjs";
import { BeneficiaryService } from "../../../../../../../shared-library/src/lib/services/beneficiary/beneficiary.service";
import { FileUploadService } from "../../../../../../../shared-library/src/lib/services/file-upload/file-upload.service";
import { GuaranteeService } from "../../../../../../../shared-library/src/lib/services/guarantee/guarantee.service";
import { StepService } from "../../../../../../../shared-library/src/lib/services/step/step-service.service";
// import { EnuCorrespondance } from "core.shared/Typescript/Enumerations/V1/enuCorrespondance";
import { EnuCorrespondance } from "../../../../../../../shared-library/src/lib/enumerations/v1/enuCorrespondance";
import { DocumentService } from "../../../../../../../shared-library/src/lib/services/document/document.service";
import { ToastMessageService } from "../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { LoaderService } from "../../../../../../../shared-library/src/lib/presentation/ui-elements/loader/loader.facade.service";

interface IpecaTypeDocumentRequest {
  Correspondances: number[];
}

@Injectable({
  providedIn: "root",
})
export class BeneficiaryFacadeService {
  participantService = inject(ParticipantService);
  private fileUploadService = inject(FileUploadService);
  private beneficiaryService = inject(BeneficiaryService);
  private guaranteeService = inject(GuaranteeService);
  private stepService = inject(StepService);
  private documentService = inject(DocumentService);
  private loaderFacade = inject(LoaderService);
  private toast = inject(ToastMessageService);

  constructor() {}

  downloadForesightBeneficiaryDesignationFile(data: any) {
    console.log("downloadForesightBeneficiaryDesignationFile", data);
    const payload = {
      numParticipant: data.numeroParticipant,
      numAttestation: data.numAttestation,
      id: data.id,
      banqueInfo: {
        domiciliation: data.domiciliation,
        titulaire: data.titulaire,
        iban: data.iban,
        bicSwift: data.bic,
      },
      email: data.email,
      phone: data.telephonePortable || data.telephone,
      adresse: {
        adresse1: data.adresse?.adresse1,
        adresse2: data.adresse?.adresse2,
        adresse3: data.adresse?.adresse3,
        codePostal: data.adresse?.codePostal,
        ville: data.adresse?.ville,
        pays: data.adresse?.pays,
        isSiteWeb: true,
        platform: data.platform,
        browser: data.browser,
        engine: data.engine,
      },
      montant: 0,
      service: data.service,
      isAirbus: data.isAirbus,
      activationCode: data.activationCode,
    };
    return this.participantService.GetDeathBeneficiaryDesignationFile(payload);
  }

  downloadDeathOptionChoiceFile(data: any) {
    const payload = {
      numParticipant: data.numeroParticipant,
      numAttestation: data.numAttestation,
      id: data.id,
      banqueInfo: {
        domiciliation: data.domiciliation,
        titulaire: data.titulaire,
        iban: data.iban,
        bicSwift: data.bic,
      },
      email: data.email,
      phone: data.telephonePortable || data.telephone,
      adresse: {
        adresse1: data.adresse?.adresse1,
        adresse2: data.adresse?.adresse2,
        adresse3: data.adresse?.adresse3,
        codePostal: data.adresse?.codePostal,
        ville: data.adresse?.ville,
        pays: data.adresse?.pays,
        isSiteWeb: true,
        platform: data.platform,
        browser: data.browser,
        engine: data.engine,
      },
      montant: 0,
      service: data.service,
      isAirbus: data.isAirbus,
      activationCode: data.activationCode,
    };
    return this.participantService.GetDeathOptionChoiceFile(payload);
  }

  getToken() {
    return this.participantService.getToken();
  }

  getCurrentParticipant() {
    return this.participantService.getCurrentParticipant().pipe(
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }

  /**
   * Documents methods
   */

  submitDocumentStep(payload: any) {
    return this.documentService.submitDocumentStepAsync(payload);
  }

  /**
   * Beneficiary methods
   */

  saveTempBeneficiary(payload: any) {
    return this.beneficiaryService.saveTempBeneficiary(payload);
  }

  /**
   * fileUpload methods
   * @params section : string : name from the controller
   */
  getFiles(section: string) {
    return this.fileUploadService.getFiles(section);
  }

  clearFiles(section: string) {
    return this.fileUploadService.clear(section);
  }

  /**
   * guarantee Methods
   */

  getContribution() {
    return this.guaranteeService.GetMyContributionAirbusAsync().pipe(
      map(response => response.data),
      catchError(err => {
        this.toast.danger("Erreur", "Impossible de charger les données");
        return of([]);
      })
    );
  }

  /**
   * Step / journies methods
   */

  getTypeDocumentsModels(documentType: any = ""): Observable<any> {
    const ipecaCorrespondance = documentType
      ? documentType
      : EnuCorrespondance.beneficiaire_Ajout;
    const request = {
      Correspondances: [ipecaCorrespondance as number],
    } as IpecaTypeDocumentRequest;

    return this.stepService.getTypeDocumentAsync(request);
  }
}
