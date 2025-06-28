import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  inject,
  LOCALE_ID,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { rxResource, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from "rxjs";
import { CustomDateAdapter } from "../../../../../../../../shared-library/src/lib/adapters/custom-date-adapters";
import { DateInputMaskDirective } from "../../../../../../../../shared-library/src/lib/directive/mask-date.directive";
import { BannerInformationComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/banner-information/banner-information.component";
import { ModalService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/modal-confirmation/service/modal-confirmation.service";
import { ToastMessageService } from "../../../../../../../../shared-library/src/lib/presentation/ui-elements/toast-message/service/toast-message.service";
import { FormScrollService } from "../../../../../../../../shared-library/src/lib/services/forms/form-scroll.service";
import { BeneficiaryCguComponent } from "../../../../../components/benificiary/beneficiary-cgu/beneficiary-cgu.component";
import { IpecaFileUploadComponent } from "../../../../../components/benificiary/ipeca-file-upload/ipeca-file-upload.component";
import { BeneficiaryFacadeService } from "../../../../../core/services/beneficiary/beneficiary-facade.service";
import { ParticipantFacadeService } from "../../../../../core/services/participant-facade/participant-facade.service";

import { DocumentFacadeService } from "../../facade/document-facade/document-facade.service";
import { JourniesFacadeService } from "../../facade/journies-facade.service";

import { AutofocusDirective } from "../../../../../../../../shared-library/src/lib/directive/autofocus/autofocus.directive";
import { FileDownloadService } from "../../../../../../../../shared-library/src/lib/services/download/file-download.service";
import { MY_DATE_FORMATS } from "../../../../../../../../shared-library/src/lib/models/date/custom-date-format";
import { dateRangeWithinNextMonthValidator } from "../../../../../../../../shared-library/src/lib/validators/date/dateRangeToNextMonth.validator";
import { effect } from "@angular/core";
import { ListState } from "../../../../../../../../shared-library/src/lib/models/state/list-state.model";
import { SkeletonTableLoaderComponent } from "../../../../../../../../shared-library/src/lib/presentation/layout/loader/skeleton-table-loader/skeleton-table-loader.component";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-hospital-coverage",
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: LOCALE_ID, useValue: "fr-FR" },
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  imports: [
    CommonModule,
    BeneficiaryCguComponent,
    BannerInformationComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTooltipModule,
    IpecaFileUploadComponent,
    DateInputMaskDirective,
    MatAutocompleteModule,
    AutofocusDirective,
    SkeletonTableLoaderComponent,
  ],
  templateUrl: "./hospital-coverage.component.html",
  styleUrl: "./hospital-coverage.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class HospitalCoverageComponent {
  loadingState$ = new BehaviorSubject<ListState<any>>({
    loading: false,
    error: null,
    data: [],
  });
  //dependencies
  fb = inject(FormBuilder);
  datePipe = inject(DatePipe);
  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  @ViewChild("companyInput") companyInput!: ElementRef<HTMLInputElement>;
  @ViewChild("cityInput", { read: MatAutocompleteTrigger })
  cityAutocompleteTrigger!: MatAutocompleteTrigger;
  sectionName = "HospitalCareStepForm";

  //services
  modalService = inject(ModalService);
  toast = inject(ToastMessageService);
  participantFacade = inject(ParticipantFacadeService);
  stepFacade = inject(JourniesFacadeService);
  documentFacade = inject(DocumentFacadeService);
  beneficiaryService = inject(BeneficiaryFacadeService);
  formScroll = inject(FormScrollService);
  file = inject(FileDownloadService);

  // declarations
  beneficiaryList = signal<any[] | null>([]);
  selectedBeneficiary = signal<any>(null);
  bannerUploadFileList = signal<string[]>([]);
  currentParticipant = signal<any>(null);
  selectedCompanyByFinessCode = signal<any>(null);

  companyNotFound = signal<boolean>(false);
  useOtherCompanyFax = signal<boolean>(false);
  finessCodeMaxChar = 9;
  entryNumberMaxChar = 30;
  faxPattern: string = "^(0|\\+33|0033)[1-9][0-9]{8}$";

  form = this.fb.group(
    {
      beneficiary: ["", Validators.required],
      dateStart: [null, Validators.required],
      dateEnd: [null, Validators.required],
      enterNumber: [null],
      //next
      finessCode: ["", Validators.required],
      finessCodeNotFound: [false],
      city: [""],
      companyName: [""],
      companyAdress: [""],
      companyFax: [""],
      userOtherCompanyFax: [false],
      otherCompanyFax: [null, [Validators.pattern(this.faxPattern)]],
      companyNotFound: [false],
      message: [""],
    },
    { validators: dateRangeWithinNextMonthValidator() }
  );

  cities = toSignal(
    this.stepFacade.getAllCities().pipe(
      map((response: any) => {
        return response?.data;
      })
    ),
    { initialValue: [] }
  );
  // citiesResource = rxResource({
  //   request: () => ({}), // Paramètres de la requête, vide si aucun paramètre
  //   loader: () =>
  //     this.stepFacade
  //       .getAllCities()
  //       .pipe(map((response: any) => response?.data)),
  // });
  readonly cityInput = toSignal(
    this.form
      .get("city")
      ?.valueChanges?.pipe(startWith(""), distinctUntilChanged()) ?? of(""),
    { initialValue: "" }
  );

  readonly cityInput$ = toObservable(this.cityInput);
  readonly cities$ = toObservable(this.cities);
  filteredCompanies$: Observable<any[]> = of([]);
  filteredCompanies: any[] = [];

  allCompanies: any[] = [];

  bannerText =
    "La durée de validité d'une prise en charge hospitalière est de 1 mois à compter de sa date d'émission.";
  codeFinessTooltip = `
    Où trouver un code FINESS :
    • Bulletin d'admission
    • Bulletin de situation
    • À l'accueil de l'établissement
  `;

  // constructor() {
  //   effect(() => {
  //     console.log("État actuel de citiesResource :", this.citiesResource);
  //     console.log("Loading :", this.citiesResource.isLoading());
  //     console.log("Value :", this.citiesResource.value());
  //     console.log("Error :", this.citiesResource.error());
  //   });
  // }

  ngAfterViewInit() {
    const cityControl = this.form.get("city");
    cityControl?.valueChanges.subscribe(value => {
      // Ne jamais ouvrir le panel si le champ est désactivé
      if (cityControl.disabled) {
        this.cityAutocompleteTrigger.closePanel();
        return;
      }
      const query = typeof value === "string" ? value : "";
      query.length >= 2
        ? this.cityAutocompleteTrigger.openPanel()
        : this.cityAutocompleteTrigger.closePanel();
    });
  }

  readonly filteredCities$: Observable<string[]> = combineLatest([
    this.cityInput$,
    this.cities$,
  ]).pipe(
    map(([rawValue, cities]) => {
      const query =
        typeof rawValue === "string" ? rawValue.toLowerCase().trim() : "";

      if (query.length < 2) return [];
      return (cities ?? [])
        .filter((city: string | null): city is string => !!city)
        .filter((city: string) => city.toLowerCase().includes(query))
        .slice(0, 10);
    })
  );

  ngOnInit(): void {
    this.initializeBeneficiary();
    this.initializeParticipant();
    this.setupFinessCodeNotFoundListener();
    this.setupCompanyFaxListener();
    this.disableDefaultControl();
    this.setupCompanyNotFoundListener();
  }

  setupCompanyAutocomplete() {
    const companyControl = this.form.get("companyName") as FormControl;

    if (!companyControl) {
      console.warn(
        'Le contrôle "companyName" est introuvable dans le formulaire.'
      );
      return;
    }

    this.filteredCompanies$ = companyControl.valueChanges.pipe(
      startWith(""),
      map(value => {
        const filterValue = value?.toLowerCase() ?? "";
        const result = this.allCompanies.filter(company =>
          company.nom.toLowerCase().includes(filterValue)
        );
        return result;
      })
    );
  }

  onTypeSelected(row: any) {
    this.selectedBeneficiary.set(row || null);
  }

  onCodeFinessChange(): void {
    const codefiness: string = this.form.get("finessCode")?.value ?? "";
    if (codefiness.length < 9) return;

    const localisation$ =
      this.stepFacade.getLocalisationByCodeFiness(codefiness);

    (localisation$ ?? of(null))
      .pipe(
        filter((res): res is { data: any } | null => true), // on laisse passer même si null
        map(res => (res ? res.data : null)),
        tap(localisation => {
          if (localisation) {
            // Mise à jour des champs de formulaire
            this.form.get("city")?.setValue(localisation.ville);
            this.form.get("companyName")?.setValue(localisation.nom);
            this.form
              .get("companyAdress")
              ?.setValue(
                localisation.adresse1 ||
                  localisation.adresse2 ||
                  localisation.adresse3
              );
            this.form.get("companyFax")?.setValue(localisation.fax);

            // if (
            //   this.cityAutocompleteTrigger &&
            //   this.cityAutocompleteTrigger.panelOpen
            // ) {
            //   this.cityAutocompleteTrigger.closePanel();
            // }
          } else {
            // Si pas de localisation trouvée, on vide les champs
            this.toast.danger(
              "Recherche de code FINESS",
              "Aucun établissement trouvé",
              3000,
              () => this.form.get("finessCode")?.setValue("")
            );

            this.form.get("city")?.setValue("");
            this.form.get("companyName")?.setValue("");
            this.form.get("companyAdress")?.setValue("");
            this.form.get("companyFax")?.setValue("");
          }
        }),
        switchMap(localisation => {
          if (!localisation) return of([]);
          const companies$ = this.stepFacade.getLocalisationByCity(
            localisation.ville
          );
          return (companies$ ?? of([])).pipe(
            tap(companies => {
              const selectedCompany = companies.find(
                (c: any) => c.nom === localisation.nom
              );
              this.selectedCompanyByFinessCode.set(selectedCompany);
              this.form.get("companyName")?.setValue(selectedCompany);
              console.log(
                "Établissement trouvé par nom dans la ville :",
                selectedCompany
              );
            })
          );
        })
      )
      .subscribe(companies => {
        this.filteredCompanies$ = of(companies);
      });
  }

  onCitySelected(event: any) {
    const selectedCity = event.option.value;
    console.log("Ville sélectionnée :", selectedCity);

    this.filteredCompanies$ = (
      this.stepFacade.getLocalisationByCity(selectedCity) ?? of([])
    ).pipe(
      tap(localisation => {
        const companyControl = this.form.get("companyName");
        companyControl?.enable();
        console.log(localisation);
        this.allCompanies = localisation;
        this.setupCompanyAutocomplete();

        if (companyControl?.enabled && !companyControl.disabled) {
          setTimeout(() => {
            this.companyInput.nativeElement.focus();
          }, 0);
        }
      })
    );
  }

  displayCompanyName(company: any) {
    return company ? company.nom : "";
  }

  onCompanySelected(event: any) {
    const selectedCompany = event.option.value;
    const companyAdressControl = this.form.get("companyAdress");
    companyAdressControl?.setValue(
      selectedCompany.adresse1 +
        "\n" +
        selectedCompany.adresse2 +
        "\n" +
        selectedCompany.adresse3
    );
    // companyAdressControl?.enable();
    const companyFaxControl = this.form.get("companyFax");
    companyFaxControl?.setValue(selectedCompany.fax);
    const finessCodeControl = this.form.get("finessCode");
    finessCodeControl?.setValue(selectedCompany.numeroFINESS);
  }

  onFileSelected(row: any) {}

  initializeParticipant() {
    this.participantFacade
      .getCurrentParticipant()
      .pipe(
        catchError(err => {
          this.toast.danger("Erreur", "Impossible de charger les données");
          return of([]);
        })
      )
      .subscribe(partipant => {
        this.currentParticipant.set(partipant);
      });
  }

  initializeBeneficiary() {
    this.beneficiaryService
      .getAllBeneficiary()
      .pipe(
        catchError(err => {
          this.toast.danger("Erreur", "Impossible de charger les données");
          return of([]);
        })
      )
      .subscribe(beneficiaries => {
        this.beneficiaryList.set(beneficiaries);
      });
  }

  disableDefaultControl() {
    const cityControl = this.form.get("city");
    const companyControl = this.form.get("companyName");
    const companyAdressControl = this.form.get("companyAdress");

    cityControl?.disable();
    companyControl?.disable();
    companyAdressControl?.disable();
  }

  private setupFinessCodeNotFoundListener() {
    const finessCodeNotFoundControl = this.form.get("finessCodeNotFound");
    const finessCodeControl = this.form.get("finessCode");
    const companyAdressControl = this.form.get("companyAdress");
    const companyNameControl = this.form.get("companyName");
    const cityControl = this.form.get("city");
    const companyFaxControl = this.form.get("companyFax");

    companyAdressControl?.disable();

    if (finessCodeNotFoundControl && finessCodeControl && cityControl) {
      finessCodeNotFoundControl.valueChanges.subscribe(isChecked => {
        if (isChecked) {
          finessCodeControl.disable();
          cityControl.enable();
        } else {
          finessCodeControl.enable();
          cityControl.disable();
          cityControl.setValue("");
          finessCodeControl.setValue("");
          companyAdressControl?.setValue("");
          companyNameControl?.setValue("");
          companyFaxControl?.setValue("");
        }
      });
    }
  }

  private setupCompanyFaxListener() {
    const userOtherCompanyFaxControl = this.form.get("userOtherCompanyFax");
    const faxControl = this.form.get("companyFax");
    faxControl?.disable();

    if (userOtherCompanyFaxControl) {
      userOtherCompanyFaxControl.valueChanges.subscribe(isChecked => {
        this.useOtherCompanyFax.set(isChecked ? true : false);
        isChecked
          ? userOtherCompanyFaxControl?.disable()
          : userOtherCompanyFaxControl?.enable();
      });
    }
  }

  private setupCompanyNotFoundListener() {
    const companyNotFoundControl = this.form.get("companyNotFound");
    const finessCodeNotFoundControl = this.form.get("finessCodeNotFound");
    const finessCodeControl = this.form.get("finessCode");
    const cityControl = this.form.get("city");

    if (companyNotFoundControl) {
      companyNotFoundControl.valueChanges.subscribe(isChecked => {
        this.companyNotFound.set(isChecked ? true : false);
        finessCodeNotFoundControl?.setValue(isChecked ? true : false);
        isChecked ? finessCodeControl?.disable() : finessCodeControl?.enable();
        cityControl?.disable();
      });
    }
  }
  enableAllInput() {
    this.form.get("companyName")?.enable();
    this.form.get("companyAdress")?.enable();
    this.form.get("companyFax")?.enable();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.formScroll.scrollToFirstInvalidControl();
      return;
    }
    if (this.form.valid) {
      const modalData = {
        title: "Prise en charge hospitalière ",
        message: `Êtes-vous sûr(e) de vouloir transmettre cette demande ?`,
        confirmText: "Oui",
        cancelText: "Non",
        confirmColor: "warn",
      };

      this.modalService
        .openConfirmationModal(modalData)
        .subscribe(confirmed => {
          if (confirmed) {
            this.loadingState$.next({ loading: true, error: null, data: [] });
            this.enableAllInput();
            const payload = this.createPayload();
            this.stepFacade
              .saveHospitalCoverage(payload)
              .pipe(
                catchError(err => {
                  this.toast.danger(
                    "Erreur",
                    "Impossible de valider les données"
                  );
                  return of([]);
                })
              )
              .subscribe({
                next: response => {
                  this.handleApiResponse(response);
                },
                error: err => {
                  this.loadingState$.next({
                    loading: false,
                    error: err,
                    data: [],
                  });
                  this.toast.danger(
                    "prise en charge hospitalière",
                    "Erreur lors de l'envoi de la demande de prise en charge hospitalière"
                  );
                  console.error(
                    "Erreur lors de l'envoi de la demande de prise en charge hospitalière :",
                    err
                  );
                },
              });
          }
        });
    }
  }

  private reload() {
    location.reload();
  }

  private handleApiResponse(response: any): void {
    // Cas 1 : erreur directe
    if (response?.errorMessage) {
      this.loadingState$.next({
        loading: false,
        error: null,
        data: response,
      });
      this.toast.danger(
        "Erreur",
        response.errorMessageDetailed || response.errorMessage
      );
      return;
    }

    const messageRetour = response?.message_Retour || [];

    // Cas 2 : erreur de type ERR
    const error = messageRetour.find((msg: any) => msg.type === "ERR");
    if (error) {
      this.loadingState$.next({
        loading: false,
        error: null,
        data: response,
      });
      this.toast.danger("Erreur", error.message);
      return;
    }

    // Cas 3 : message PDF pour le document
    const infoMessage = messageRetour.find((msg: any) => msg.type === "INFO");
    this.toast.success("Prise en charge hospitalière", infoMessage.message);
    const pdfMessage = messageRetour.find((msg: any) => msg.type === "PDF");
    if (pdfMessage) {
      const document = {
        typeDocument: pdfMessage.type,
        cleDocument: pdfMessage.message,
      };
      this.stepFacade
        .download(document.cleDocument, document.typeDocument)
        .subscribe({
          next: response => {
            this.loadingState$.next({
              loading: false,
              error: null,
              data: response,
            });
            console.log(response);
            if (response.message_Retour_nombre > 0) {
              if (
                response.message_Retour.message == "Type de document inconnu"
              ) {
                this.toast.info(
                  "Prise en charge hospitalière ",
                  "La demande n'a pu aboutir. Document de prise en charge déjà traité."
                );
              } else if (
                response.message_Retour.type == "INFO" &&
                response.message_Retour.message
              ) {
                this.toast.info(
                  "Prise en charge hospitalière ",
                  response.message_Retour.message
                );
              }
            }
          },
          error: err => {
            this.loadingState$.next({
              loading: false,
              error: err,
              data: [],
            });
          },
        });
    }

    // Cas 4 : succès + messages info/err
    if (response?.isSuccess) {
      this.loadingState$.next({
        loading: false,
        error: null,
        data: response,
      });
      const info = messageRetour.find((msg: any) => msg.type === "INFO");
      const fallbackErr = messageRetour.find((msg: any) => msg.type === "ERR");

      if (info) {
        this.toast.info("Information", info.message, 3000, () => this.reload());
      } else if (fallbackErr) {
        this.toast.info("Information", fallbackErr.message); // dans le C# c'est affiché aussi
      }

      // Enfin, message de succès général
      this.toast.success(
        "Succès",
        "La demande de prise en charge hospitalière a été envoyée avec succès.",
        3000,
        () => this.reload()
      );
    }
  }

  createPayload() {
    const startDate = this.form?.get("dateStart")?.value ?? "";
    const dateEnd = this.form?.get("dateEnd")?.value ?? "";
    return {
      numeroParticipant: this.currentParticipant().numeroParticipant,
      codeFiness: this.form?.get("finessCode")?.value,
      dateEntree: new Date(startDate),
      dateSortie: new Date(dateEnd),
      idBeneficiaire: this.selectedBeneficiary().id,
      IdBeneficiaireSpecified: true,
      IdParticipantSpecified: true,
      autreFax: this.form?.get("companyFax")?.value,
      autreInformation: this.form?.get("companyFax")?.value || "",
      referenceDossier: this.form?.get("enterNumber")?.value || "",
      isSiteWeb: true,
      platform: "",
      browser: "",
      engine: "",
    };
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);

    if (!control || !control.errors || !control.touched) return "";

    if (control.hasError("required")) {
      return controlName === "reason"
        ? "Vous devez sélectionner un motif valide"
        : "Ce champ est obligatoire";
    }

    if (control.hasError("franceSSN")) {
      return control.errors["franceSSN"].message;
    }
    if (control.hasError("pattern")) {
      return "Format invalide";
    }
    if (control.hasError("pattern") && controlName === "otherCompanyFax") {
      return "Le n°de FAX saisi n’est pas valide";
    }
    if (controlName === "finessCode") {
      if (control.hasError("minlength") || control.hasError("minlength")) {
        return "Le code Finess saisi est invalide";
      }
      return "Valeur invalide";
    }

    if (control.hasError("maxlength")) {
      return "Nombre de caractère maximal atteint";
    }

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);

    // Gestion du cas où le mois suivant n'a pas ce jour (ex: 31 février)
    if (nextMonth.getDate() !== now.getDate()) {
      nextMonth.setDate(0);
    }

    if (control.hasError("dateRangeInvalid")) {
      // Si le validateur a mis un message, on l'affiche, sinon message générique
      const err = control.getError("dateRangeInvalid");
      if (typeof err === "string") return err;
      if (typeof err === "object" && err?.message) return err.message;
      return `Veuillez saisir une date comprise entre le ${now.toLocaleDateString(
        "fr-FR"
      )} et le ${nextMonth.toLocaleDateString("fr-FR")}  `;
    }

    return "Valeur invalide";
  }
}
