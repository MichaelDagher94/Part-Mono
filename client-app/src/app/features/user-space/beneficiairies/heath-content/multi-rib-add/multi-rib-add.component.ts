import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs";
import { BeneficiaryRequest } from "../../../../../../../../shared-library/src/lib/models/beneficiary/request/BeneficiaryRequest";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { BeneficiaryFacadeService } from "../../../../../core/services/beneficiary/beneficiary-facade.service";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";
import { MultiRibFacadeService } from "../multi-rib-management/facade/multi-rib.facade.service";

@Component({
  selector: "app-multi-rib-add",
  imports: [
    BeneficiaryCguComponent,
    IpecaFileUploadComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./multi-rib-add.component.html",
  styleUrl: "./multi-rib-add.component.scss",
})
export class MultiRibAddComponent implements OnInit {
  //dependencies
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  beneficiaryFacade = inject(BeneficiaryFacadeService);
  participantFacade = inject(ParticipantFacadeService);
  multiRibFacade = inject(MultiRibFacadeService);
  modalService = inject(ModalService);
  toast = inject(ToastMessageService);

  //declarations
  sectionName = "AddMultiRibBeneficiaryForm";
  currentUser = signal<any>("");
  currentBeneficiary = signal<any>("");
  beneficiaryForm!: FormGroup;
  @ViewChild(IpecaFileUploadComponent)
  fileUpload!: IpecaFileUploadComponent;

  ngOnInit(): void {
    this.getCurrentUser();
    this.initializeCurrentBenef();
    this.formInitialization();
  }

  formInitialization() {
    this.beneficiaryForm = this.fb.group({
      // domiciliation: ["Banque de Paris", Validators.required],
      domiciliation: ["", Validators.required],
      titulaire: ["", Validators.required],
      /*  iban: [
        "FR7630006000011234567890189",
        [
          Validators.required,
          // Validators.pattern(/^([A-Z]{2}[0-9]{2}[A-Z0-9]{1,30})$/),
        ],
      ],*/
      iban: [
        "",
        [
          Validators.required,
          // Validators.pattern(/^([A-Z]{2}[0-9]{2}[A-Z0-9]{1,30})$/),
        ],
      ],
      /*bic: [
        "BNPAFRPPXXX",
        [
          Validators.required,
          // Validators.pattern(/^([A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?)$/),
        ],
      ],*/

      bic: [
        "",
        [
          Validators.required,
          // Validators.pattern(/^([A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?)$/),
        ],
      ],
      file: [null, Validators.required],
    });
  }

  getCurrentUser() {
    this.participantFacade.getCurrentParticipant().subscribe(user => {
      this.currentUser.set(user);
    });
  }

  initializeCurrentBenef() {
    const request = new BeneficiaryRequest();
    request.numParticipant = this.currentUser().numParticipant;

    this.route.params
      .pipe(
        switchMap(params => {
          const beneficiaryId = params["id"];
          return this.beneficiaryFacade.findOneBeneficiary(
            request,
            beneficiaryId
          );
        })
      )
      .subscribe(beneficiary => {
        this.currentBeneficiary.set(beneficiary);
      });
  }
  onFilesChanged(files: File[]): void {
    console.log("file changed", files);
    this.beneficiaryForm.patchValue({
      file: files, // Met à jour le champ 'file' dans le formulaire
    });
  }

  /*  if valid : update iban of the beneficiary
    /api/v1/Participant/updateiban
  */
  onSubmit() {
    if (this.beneficiaryForm?.get("file")?.value == null) {
      this.toast.warning(
        "Attention",
        "Veuillez téléverser la(es) Pièce(s) jointe(s)"
      );
    }

    if (this.beneficiaryForm.valid) {
      console.log(this.beneficiaryForm.value);
      const modalData = {
        title: "Ajouter multi RIB",
        message: `Êtes-vous sûr(e) de vouloir modifier les informations de votre bénéficiaire ${
          this.currentBeneficiary().nom
        } ${this.currentBeneficiary().prenom} ?`,
        confirmText: "OUI",
        cancelText: "NON",
      };
      this.modalService
        .openConfirmationModal(modalData)
        .subscribe((confirmed: boolean) => {
          if (confirmed) {
            const payload = this.preparePayload(this.beneficiaryForm.value);
            const res = this.multiRibFacade.updateIbanBeneficiary(payload);

            if (res) {
              this.toast.success("Succes", "Enregistrement effectué");
              this.allformReset();
            }
          }
        });
    }
  }

  allformReset() {
    const emptyState = {
      domiciliation: "",
      titulaire: "",
      iban: "",
      bic: "",
      file: null,
    };

    this.beneficiaryForm.reset(emptyState, { emitEvent: false });
    Object.keys(this.beneficiaryForm.controls).forEach(key => {
      const control = this.beneficiaryForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });

    this.beneficiaryForm.updateValueAndValidity();
    this.fileUpload.clearFiles();
  }

  preparePayload(data: any) {
    return {
      numParticipant: this.currentUser().numeroParticipant,
      numAttestation: "",
      id: "",
      banqueInfo: {
        domiciliation: data.domiciliation,
        titulaire: data.titulaire,
        iban: data.iban,
        bicSwift: data.bic,
      },
      email: "",
      phone: "",
      adresse: {
        adresse1: "",
        adresse2: "",
        adresse3: "",
        codePostal: "",
        ville: "",
        pays: "",
      },
      password: "",
      oldPassword: "",
      iban: data.iban,
      origine: "IPECA#RBD",
      domiciliation: data.domiciliation,
      titulaire: data.titulaire,
      bic: data.bic,
      bicSwift: data.bic,
      envoiemail: "",
      decompteCode: "",
      dateEmission: "",
      montant: 0,
      service: "",
      isSiteWeb: true,
      platform: navigator.platform,
      browser: "",
      engine: "",
      isAirbus: false,
      activationCode: "",
    };
  }
}
