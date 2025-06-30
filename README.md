# Part-Mono

// reviewed technical standards-requirements-examples.txt
1. Introduction

 1.1 Purpose of This Document

This document outlines the technical foundation, or "socle," for a dual-application MonoRepo. Its primary objectives are:

1. To define and provide guidance for developing an internal Admin application responsible for log viewing, user-registration management, and other back-office functions.
2. To establish a shared architecture and recommended practices to facilitate the seamless migration of the existing client-facing portal from Orchard Core to Angular.
3. To define and guide the development of a centralized Login application, responsible for authenticating users, directing them to either the Admin or Client applications, and managing inter-application communication.

While business logic, such as reimbursements, beneficiary management, and tier-paying card functionalities inform data requirements and workflows, this document emphasizes technical scaffolding, coding standards, and a modular component structure. This approach ensures maintainability, scalability, and straightforward onboarding for both internal and external development teams.

 1.2 Scope

This document covers the following areas:

. Folder Structures & Routing: Recommendations for clear, organized layouts to enhance readability and navigation.
. Architectural Approach: Implementation of a monorepo setup using Angular CLI, with optional Nx support, and adopting a feature-based, domain-driven architecture.
. Core Services & Shared Components: Guidelines for building reusable services like authentication, logging, API interactions, as well as UI elements like headers, footers, and modals.
. Configuration & Security: Best practices for environment management, error handling, HTTP interceptors, and secure token handling.
. Coding & Naming Conventions: Standards aligned with Angular best practices to maintain consistency across the project.
. State Management: Principles for leveraging RxJS and Angular Signals to manage application state effectively.
. Standardization: Recommendations for consistent API interaction patterns, UI layouts, themes, and general design principles.

Overall, this guidance aims to streamline the transition from Orchard Core to Angular and establish a robust foundation for future developments aligned with organizational standards.



 2. Architecture Vision and Overview

The Angular technical foundation described in this document supports multiple front-end applications within a single monorepo, maintaining a clear, domain-driven structure. Utilizing Angular CLI, with potential extension through Nx, the monorepo centralizes code, promotes reusable libraries, and ensures consistent coding practices across all applications. The structure consists of three Angular 19 applications:

. Admin Application: Manages back-office operations including log management, user registration, and administrative tasks.
. Client Application: Provides a user-facing portal catering to external clients and users.
. Login Application: Centralizes authentication and directs users to the appropriate application based on their roles and permissions.

 2.1 Monorepo Setup

. Unified Repository: The Admin, Client, and Login applications reside within a single code repository, alongside shared libraries for common services, models, and UI components.
. Centralized Tooling: Uniform linting, testing, and continuous integration/deployment configurations ensure code quality and consistency.
. Governance: A unified repository facilitates easier oversight, streamlined versioning, and adherence to internal standards.

 2.2 Domain-Driven, Feature-Based Architecture

. Domain Organization: Major business domains, such as user management or reimbursements, are structured as self-contained features corresponding directly to sets of views or screens. For instance, the "Beneficiaries" domain encapsulates all pages related to beneficiary management.
. Clear Boundaries: Interaction between domains occurs through well-defined interfaces and shared services, minimizing coupling and simplifying future expansions.

 2.3 Modern Angular Practices (v19)

. Standalone Components & Signals: Adoption of Angular’s standalone components to reduce boilerplate and Angular Signals for granular and efficient state management.
. Lazy Loading: Strategic use of lazy loading for large or infrequently accessed features, enhancing application performance. The Login Application, in particular, benefits from lazy-loaded authentication flows.

 2.4 Shared "Socle" Libraries

. Core Services and Utilities: A reusable infrastructure layer providing consistent authentication, logging, environment configurations, and HTTP communications shared across the Admin, Client, and Login applications.
. Common UI Components: Shared libraries host reusable UI components such as headers, footers, forms, and modals, ensuring consistency across applications. These components maintain simple, logic-free templates, while application-specific logic remains within the respective application.

 2.5 Incremental Migration from Orchard Core

. Step-by-Step Migration Strategy: The monorepo and domain-driven architecture facilitate a gradual and smooth migration from the existing Orchard Core platform to Angular components and libraries.
. Centralized Authentication Transition: The Login Application eases user transition by managing authentication centrally and routing authenticated users seamlessly to the correct application.









 3. Folder Structure

The monorepo utilizes a consistent, scalable, and maintainable directory structure. This layout simplifies navigation, 
reduces friction during onboarding, and promotes clear boundaries between applications and shared libraries.

 3.1 Top-Level Monorepo Structure

The root-level structure recommended for the MyIpecaEvolis monorepo is:


MyIpecaEvolis/
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
├── projects/
│   ├── admin-app/
│   ├── client-app/
│   ├── login-app/
│   └── shared-library/
├── .editorconfig
├── .gitignore
├── angular.json
├── CHANGELOG.md
├── MyIpecaEvolis.esproj
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json


Key considerations at this level include:

 Workspace Configuration: Essential configuration files (angular.json, tsconfig.json, .editorconfig) ensure consistency across all projects.
 Projects Directory: Contains individual applications (admin-app, client-app, login-app) and a common shared-library.
 Shared Library: Houses reusable components, services, models, guards, interceptors, and UI elements.

---

 3.2 Recommended Application Structure

Each application (admin-app, client-app, login-app) maintains a consistent, feature-oriented layout as detailed below:


app/
├── app.component.html
├── app.component.scss
├── app.component.ts
├── app.config.ts
├── app.routes.ts
│
├── core/
│   ├── components/
│   │   ├── header/
│   │   └── navbar/
│   └── services/
│       ├── authentication/
│       │   └── authentication-facade.service.ts
│       └── participant/
│           └── participant-facade.service.ts
│
├── features/
│   ├── feature-name/
│   │   ├── pages/
│   │   │   └── feature-page/
│   │   │       ├── feature-page.component.html
│   │   │       ├── feature-page.component.scss
│   │   │       ├── feature-page.component.ts
│   │   │       └── feature-page.component.spec.ts
│   │   ├── services/
│   │   │   └── feature-facade.service.ts
│   │   └── feature.routes.ts
│   └── private-layout/
│       ├── private-layout.component.html
│       ├── private-layout.component.scss
│       ├── private-layout.component.ts
│       └── private-layout.component.spec.ts
│
├── shared/
│   └── services/
│       └── app-specific-helper.service.ts
│
├── environments/
│   ├── environment.ts
│   ├── environment.dev.ts
│   ├── environment.int.ts
│   ├── environment.sta.ts
│   └── environment.prod.ts
│
├── index.html
├── main.ts
└── styles.scss


Detailed Explanation:

 Core Folder

 Contains globally reusable services, components, and guards essential to the entire application (e.g., authentication logic, interceptors, session management).

 Features Folder

 Structured by distinct business domains or features (e.g., logs, users-management, beneficiaries).
 Each feature folder encapsulates:

   Pages: UI components for displaying and interacting with data.
   Services (Facade): Domain-specific facades managing interaction with shared services and handling application-specific logic like caching, transformations, and state management.
   Routes: Individual routing modules within each feature, supporting modular and lazy-loaded routing configurations.

 Routing Configuration

 Top-level routing (app.routes.ts) defines primary routes.
 Feature-specific routes (<feature>.routes.ts) handle internal navigation and support lazy loading, enhancing application scalability.

 Shared Folder

 Contains application-specific helper services or utilities not tied directly to external API interactions. Shared-library services handling CRUD or external interactions are not placed here but rather in dedicated facades in each feature.

 Environment and Configuration Management

 Environment files (environment.ts, environment.prod.ts, etc.) allow seamless management of configuration values across multiple environments.
 Application-specific configurations (app.config.ts) clearly separate environment-specific settings from core application logic.

---

 Example Feature Structure (Admin App Logs):


features/
├── logs/
│   ├── pages/
│   │   ├── logs-list/
│   │   │   ├── logs-list.component.html
│   │   │   ├── logs-list.component.scss
│   │   │   ├── logs-list.component.ts
│   │   │   └── logs-list.component.spec.ts
│   │   └── log-item/
│   │       ├── log-item.component.html
│   │       ├── log-item.component.scss
│   │       ├── log-item.component.ts
│   │       └── log-item.component.spec.ts
│   ├── services/
│   │   └── logs-helper.service.ts
│   └── logs.routes.ts
core
├── services/
│   ├── logs-management-facade.service.ts/
 Components (e.g., logs-list, log-item) are UI-focused, subscribing to observables/signals from the facade.
 Facades (logs-management-facade.service.ts) encapsulate logic, coordinate interactions with shared-library services, handle state management (BehaviorSubject or Signals), and expose simplified methods to components.

---

 Shared Library Example Structure:


shared-library/
├── src/
│   └── lib/
│       ├── guards/
│       │   └── auth.guard.ts
│       ├── interceptors/
│       │   └── requests/
│       │       └── token-interceptor.ts
│       ├── models/
│       │   ├── authentication/
│       │   │   ├── request/
│       │   │   └── response/
│       │   └── logs.ts
│       ├── presentation/
│       │   ├── layout/
│       │   │   ├── header/
│       │   │   ├── footer/
│       │   │   └── sidenav/
│       │   └── ui-elements/
│       │       ├── banners/
│       │       └── cards/
│       └── services/
│           ├── authentication.service.ts
│           ├── logging.service.ts
│           ├── http-base.service.ts
│           └── participant.service.ts
│
├── ng-package.json
├── package.json
├── README.md
└── tsconfig.lib.json

- Clearly separates generic utilities, services, models, and UI components used across multiple applications.
- Maintains a clean, logical, and maintainable shared codebase, allowing efficient reuse and minimizing redundancy.












4. Routing

This section explains how routing is organized and managed across the Admin, Client, and Login applications within the monorepo. It emphasizes modular configurations, centralized authentication, and the strategic use of guards to protect routes. The Login application serves as the primary entry point, directing users to the correct application based on their roles or other domain-specific rules.

4.1 Overview

. Three Applications, Three Sets of Routes
Each application (Admin, Client, Login) defines its own top-level routing configuration (for example, in an app.routes.ts file) and manages feature-specific routes in dedicated folders.

. Centralized Login and Redirection
The Login application consolidates all authentication processes. After validating user credentials, it routes the user to either the Admin or Client application as appropriate.

. Reusable Services and Guards
Common logic, such as verifying user authentication or token validity, is placed in shared or core folders to ensure consistency across all applications.

4.2 Login Application

. Purpose
The Login application acts as the central authentication portal. All users initially access the system here, providing credentials and receiving tokens or session details.

. Routes
Typical routes include /login, where credentials are collected, and /home or a similar endpoint that confirms successful login. From here, the application redirects users to the Admin or Client application depending on their roles or permissions.

. Authentication Workflow
Once the Login application validates credentials (for example, via a shared authentication service), it stores the session data. Role-based logic then determines whether the user proceeds to the Admin application for back-office functions or the Client application for end-user or moderator tasks.

4.3 Admin Application

. Route Definitions
The Admin application maintains a distinct app.routes.ts file that references feature-level routing modules for logs, user management, dashboard views, and other back-office functionalities.

. Feature-Based Organization
Each domain-centric folder (for example, logs, users-management) may include its own routes file (such as logs.routes.ts) that lazy-loads pages or components if needed.

. Access Control
Since administrative features typically require elevated privileges, guards often verify both authentication and role authorization. Unauthorized or unauthenticated attempts trigger a redirect back to the Login application.

. Layout Components
A dedicated PrivateLayoutComponent can wrap most internal Admin routes, adding consistent navigation elements like headers, sidebars, or footers. This layout pattern enhances clarity and promotes design uniformity.

4.4 Client Application

. Route Definitions
The Client application also defines primary routes in its app.routes.ts, covering features such as moderator-space, user-space, reimbursements, or beneficiary management.

. Similar Structure
As with the Admin application, each feature can have its own routing module (for example, moderator-space.routes.ts or user-space.routes.ts). These modules may also use lazy loading for performance benefits.

. Role-Specific Access
Certain sections of the Client application, like moderator-space, might require additional role checks. Shared guards and interceptor logic can be reused here, ensuring uniform access control.

. Post-Login Integration
Once logged in via the Login application, users can directly access Client routes. Session details and tokens are typically retrieved from shared or local storage.

4.5 Route Guards and Lazy Loading

. Shared Guards
A common AuthGuard or RoleGuard can reside in a shared library or in the core folder of each application, ensuring that the same authentication checks and permission verifications apply throughout the monorepo.

. Lazy Loading
Both the Admin and Client applications can lazily load large or infrequently visited features to reduce initial bundle size and improve perceived performance. The Login application may also opt for lazy-loaded flows, such as onboarding wizards or specialized login screens.

. Error Handling and Fallback
Missing or invalid routes typically redirect users to a default or not-found component. If a guard detects an expired or invalid session, the user is sent back to the Login application to reauthenticate.

4.6 Summary

The routing strategy in this monorepo centers on a centralized login workflow, with each application containing modular and domain-specific route definitions. Common security and guard logic is shared for consistency, while lazy loading optimizes performance. This structure streamlines authentication, authorization, and navigation across the Admin, Client, and Login applications.



 5. Facade Services Pattern: State Containers and DTO Mappers

Facade services are application-specific constructs that mediate between components and the lower-level shared or library services. In this architecture, their role is tightly focused to maintain a clear and predictable data flow.

 5.1 Overview

Facades serve two primary purposes:

1.  State Container: A facade owns the state for a specific domain (e.g., the list of beneficiaries). It uses RxJS constructs like `BehaviorSubject` to hold the raw data, loading status, and error information, and it exposes this state to the application via observables. It is also responsible for caching this state to prevent redundant API calls.
2.  DTO Mapper: A facade acts as a mapping layer that prepares data for the backend. When a component initiates an action (e.g., saving a form), the facade takes the component's data and transforms it into the specific DTO required by the shared-library service.

Under this pattern, business logic, data transformation for views, and orchestration of multiple state sources are now the responsibility of the component.

 5.2 Implementation Guidelines

1.  One Facade per Domain: Each major feature (e.g., Logs, Users, Beneficiaries) should have its own facade service to clearly delineate domain boundaries. This remains unchanged.
2.  No Direct Component-to-Shared-Service Calls: Components inject facades, never shared-library services directly. This remains unchanged.
3.  Component-Owned Domain Logic: All domain-specific logic for preparing data for the view—such as filtering, sorting, or combining data from multiple facades—occurs within the component. The facade provides the raw state streams; the component consumes and transforms them.
4.  Minimal Public Interface: A facade exposes a minimal API, which primarily consists of:
      * State observables (e.g., `data$`, `loading$`, `error$`).
      * Methods to trigger data loads (e.g., `loadData()`). These methods contain the caching logic.
      * Methods to send data to the backend (e.g., `saveData(data)`), which handle the DTO mapping.
5.  Component as Orchestrator: Components are now the central point of orchestration. It is expected and encouraged for a component to inject multiple facades and use their state streams to build the complex view models required for its template.

 5.3 Usage Example

Below is a typical scenario involving a component that needs to display a list of beneficiaries and also know the current user's role to determine if actions are permitted.

Component (BeneficiaryListComponent)

1.  Injects both `BeneficiaryFacadeService` and `AuthenticationFacadeService`.
2.  In its logic (e.g., in `ngOnInit`), it uses an operator like `combineLatest` on the `beneficiaries$` stream from its facade and the `userRole$` stream from the authentication facade.
3.  It pipes this combined stream through a `map` operator to create a final view model (`view$`) that contains the list of beneficiaries, each with a new property like `canDelete`.
4.  The component's template uses the `async` pipe on `view$` to render the list and conditionally show action buttons.

Facade (BeneficiaryFacadeService)

1.  Injects `BeneficiaryService` from the shared library.
2.  Holds a `BehaviorSubject` for the raw list of beneficiaries, loading status, and errors.
3.  Exposes a `beneficiaries$` observable. It does not expose a `filteredBeneficiaries$` or `beneficiariesWithPermissions$`.
4.  Contains a `loadBeneficiaries()` method with caching logic.

Facade (AuthenticationFacadeService)

1.  Holds and exposes the `userRole$` observable.

This pattern makes the component the explicit "owner" of its view logic, while facades serve as predictable and reusable state providers.

 5.4 Distribution & Placement Rules

*(This subsection remains largely the same, but is now interpreted through the new architectural lens.)*

1.  Core façades: Wrap a shared-library service used by every app (e.g., Authentication, Participant). Live in `core/services/<domain>`.
2.  Feature façades: Wrap one or more shared-library services scoped to a single business domain (Beneficiaries, TP-Cards, Journeys…). Reside next to their screens in `features/<feature>/services`.
3.  Utility helpers / stores: If a class contains complex, but stateless, logic that you want to extract from a smart component (e.g., a complex data transformation), it can be placed in a `<feature>-helper.service.ts` and injected directly into the component.
4.  No screen-level façades: Components must reuse the domain façade instead of creating ad-hoc wrappers. This remains a critical rule.

-----

 6. State Management

This section describes how the monorepo handles application state. The core principle is a clear separation between source state, which is managed by facades, and view state, which is derived and orchestrated by components.

 6.1 Current Approach

The project uses a hybrid approach. Facades use RxJS `BehaviorSubject` to manage the raw, persistent state fetched from the backend. Components subscribe to these streams and are responsible for all subsequent logic, using operators like `map` and `filter` to create derived state for their views. Components may also use Angular Signals for purely local, ephemeral UI state (e.g., tracking whether a dropdown is open).

 6.2 Observables for Source State and Caching

Facades are the designated owners of the source state.

  * BehaviorSubject for Shared Data: A facade uses a `BehaviorSubject` to store the latest snapshot of data from the backend (e.g., the complete list of beneficiaries). This ensures any consumer gets the most recent raw data.
  * Caching and Efficiency: The caching mechanism (e.g., `lastFetchTime`, `cacheTTL`) resides within the facade's `loadData()` method. This logic is hidden from the component; the component simply requests a load, and the facade determines if a network call is necessary.
  * Facades Expose Raw Data: Facades should not expose pre-filtered or pre-mapped observables tailored for a specific view. They provide the foundational streams (`beneficiaries$`, `users$`, etc.), and the components build upon them.

 6.3 Signals for Component-Level and Ephemeral State

*(This section remains unchanged as it aligns with the new model.)*

Angular Signals are ideal for ephemeral or localized state within individual components.

  * Local Reactivity: Signals allow instantaneous updates within a component without requiring explicit subscription and unsubscription. This is perfect for managing UI state that does not need to be shared, suchas form input values or visibility toggles.
  * Computed Signals: When a component’s local logic depends on multiple sources, `computed` signals can automatically derive new values whenever an input signal changes.

 6.4 Key Benefits of the Hybrid Model

  * Performance and Clarity: The facade efficiently manages the source-of-truth data and network requests. The component clearly and explicitly defines the logic needed for its specific view.
  * Separation of Concerns: A clean line is drawn: Facades manage the *source state*. Components manage the *view state* and business logic.
  * Scalability: This pattern scales well. New components can consume existing facade streams and apply new logic without forcing changes on the facade or other components.

 6.5 Feature State Object Pattern

*(This section remains unchanged, as it is a valuable pattern for organizing the facade's role as a state container.)*

To keep facades organized as their state requirements grow, each feature can define a single typed “state object.” This central object includes every stateful field for that feature, such as loading flags, error messages, and lists of data. The facade holds one `BehaviorSubject` containing an immutable snapshot of this state. This makes the facade’s state contract explicit and easy to manage.

-----

 Example: Refactoring a Beneficiaries List Component (New Model)

This example illustrates the new "smart component" pattern.

 Desired Setup (After Refactoring)

Facade (BeneficiaryFacadeService):
The facade is now a simple state container with caching.

```typescript
// projects/client-app/src/app/core/services/beneficiary/beneficiary-facade.service.ts

@Injectable({ providedIn: 'root' })
export class BeneficiaryFacadeService {
  private state = new BehaviorSubject<{ data: Beneficiary[], loading: boolean }>({ data: [], loading: false });
  public beneficiaries$ = this.state.asObservable().pipe(map(s => s.data));
  public loading$ = this.state.asObservable().pipe(map(s => s.loading));

  private lastFetchTime: number | null = null;
  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor(private beneficiaryService: BeneficiaryService) {}

  public fetchBeneficiaries(request: BeneficiaryRequest): void {
    if (this.lastFetchTime && (Date.now() - this.lastFetchTime) < this.cacheTTL) {
      return; // Use cached data
    }
    this.state.next({ ...this.state.value, loading: true });
    this.beneficiaryService.fetchMany(request).subscribe({
      next: response => {
        this.lastFetchTime = Date.now();
        this.state.next({ data: response.data, loading: false });
      },
      error: err => {
        this.state.next({ ...this.state.value, loading: false /*, error: err*/ });
      }
    });
  }

  public deleteBeneficiary(request: BeneficiaryRequest): Observable<void> {
    // Simply passes the call through and invalidates the cache on success
    return this.beneficiaryService.remove(request).pipe(
      tap(() => {
        this.lastFetchTime = null; // Invalidate cache
      })
    );
  }
}
```

Component (BeneficiaryListComponent):
The component is now "smart." It injects multiple facades and contains all the logic for its view.

```typescript
// projects/client-app/src/app/features/user-space/beneficiairies/pages/beneficiary-list/beneficiary-list.component.ts

@Component({...})
export class BeneficiaryListComponent implements OnInit {
  private readonly beneficiaryFacade = inject(BeneficiaryFacadeService);
  private readonly authFacade = inject(AuthenticationFacadeService); // Injects multiple facades

  // Component derives its own, specific view model
  public view$ = combineLatest([
    this.beneficiaryFacade.beneficiaries$,
    this.authFacade.userRole$ // Example: getting role from another facade
  ]).pipe(
    map(([beneficiaries, userRole]) => {
      // ALL view-specific logic and transformation happens HERE in the component
      return {
        isLoading: false, // Could also get this from facade.loading$
        beneficiaries: beneficiaries.map(b => ({
          id: b.id,
          fullName: `${b.prenom} ${b.nom}`,
          birthDate: new Date(b.dateNaissance).toLocaleDateString(),
          canDelete: userRole === 'ADMIN', // Business logic based on multiple sources
          nirMasked: this.maskNir(b.numeroSecuriteSociale) // View transformation
        }))
      };
    })
  );

  ngOnInit(): void {
    // Component triggers the action
    const req = { numParticipant: '...' } as BeneficiaryRequest;
    this.beneficiaryFacade.fetchBeneficiaries(req);
  }

  handleDelete(row: { id: string }): void {
    // Component orchestrates the entire "delete" user flow
    const deleteRequest = { id: row.id, ... } as BeneficiaryRequest;

    this.beneficiaryFacade.deleteBeneficiary(deleteRequest)
      .subscribe({
        next: () => {
          // On success, the component decides what to do next
          console.log('Delete successful, now refreshing data...');
          const refreshRequest = { numParticipant: '...' } as BeneficiaryRequest;
          this.beneficiaryFacade.fetchBeneficiaries(refreshRequest); // Trigger a refresh
        },
        error: err => console.error(err)
      });
  }

  private maskNir(raw: string): string {
    if (!raw) return '';
    return raw.replace(/^(\d{4})\d+(\d{4})$/, (_, a, b) => `${a}${'•'.repeat(raw.length - 8)}${b}`);
  }
}
```

 Key Refactoring Notes

  * Component is Orchestrator: The component now contains the `combineLatest` operator and the `map` logic to build its specific view model. It determines that an admin role is required to show a delete button.
  * Facade is State Source: The `BeneficiaryFacadeService` is simpler. It only holds and provides the raw list of beneficiaries and the caching logic. It knows nothing about user roles or how the data will be displayed.
  * Clear Responsibilities: This pattern creates a very clear separation. If the UI needs to change, you modify the component. If the backend API for beneficiaries changes, you modify the `BeneficiaryService` and potentially the `BeneficiaryFacadeService`, but the component often remains untouched.

// Context for project-gem.txt
Context: 

-Code before refactoring: 
	-components
	-helpers/utils
	-app specific facades
	-shared library services. 

-Code after refactoring: 
	-app specific facades. 
	-shared library services. 

All files provided except for components for size. 


Step by step process: 
	-I paste a component that works with pre refactored facades, services and various helpers.
	(ALL PRE Refactored). 
	-For every component, you remove references to pre refactored facade/services, and 
	replace with post refactored facades. 
	(as you can see, pre refactored code had many facades per service, i consolidated everything into 1 facade per service).
	Need to pay special attention: most facades on the same service were refactored into a single facade.
	-For all non facade services used in pre refactor code, 
	tell me if the functionality should be moved to facade/moved
	to component/kept in helper. 
	-Some facade services, despite being called facade in pre refactor, might not be related to any services. In this case 
	has to be renamed and kept/pasted into refactored branch. 
	For every component do the following:
	-Replace all @Input with input(), @Output with output(), use signals whenever possible in component.ts. 
	-Never inject service, only facades AND helpers. 
	-For facade calls from component, facade has to convert data from component to correct DTO in Core.Shared. 
	-Component can use any facade they fucking want, but no shared library services
TLDR: 
	-for every component, replace all references to pre refactored shit into reference from post refactored shit. 
	-apply provided improvements. 
	-return fully refactored component, ready to be pasted (ts).

// Architecture for refactoring.txt
Of course. Here is the detailed explanation of the architectural layers without citations.

 1. Shared-Library Services

This is the foundational data layer, responsible only for direct communication with the backend.

 Location: `projects/shared-library/src/lib/services/`

 Core Responsibilities:
     Act as a Raw HTTP Layer: Its sole purpose is to make strongly-typed HTTP calls that exactly mirror the backend API endpoints.
     Use Core.Shared DTOs: All method signatures for requests and responses must use the DTOs from the `Core.Shared` package without any modification.
     Expose Simple Methods: Methods should be simple, direct calls that map to a single API endpoint, such as `fetchMany(dto: RequestDto)` or `create(dto: CreateDto)`. They return a raw `Observable<IpecaResponseBase<T>>`.

 Key Prohibitions (What it must NOT do):
     No State: Must not contain any application state (e.g., no `BehaviorSubject` or signals).
     No Caching: Must not implement any caching or stream-sharing logic like `shareReplay`.
     No Business Logic: Must not contain any business logic, data mapping, or orchestration of multiple calls.
     No Cross-Service Injection: Must not inject another shared-library service.

 2. Facade Services

This is the application-specific layer that serves as the single, controlled gateway to a business domain's state and data operations.

 Location: `projects/client-app/src/app/core/services/<domain>/<domain>-facade.service.ts`. For example, `projects/client-app/src/app/core/services/beneficiary/beneficiary-facade.service.ts`.

 Core Responsibilities:
     State Container: This is a primary role. The facade owns the state for its domain, using RxJS `BehaviorSubject` to hold the raw data, loading status, and error information. It then exposes this state to the application via granular, readonly observables (e.g., `data$`, `loading$`, `error$`).
     DTO Mapper: The facade is responsible for translating data between the component layer and the service layer. It accepts simple, view-friendly arguments from components and maps them into the `Core.Shared` DTOs required by its underlying service.
     Caching: It implements caching logic (e.g., a Time-to-Live or `shareReplay`) to prevent redundant API calls for data that doesn't change frequently.
     Dependency Management:
         It must inject exactly one shared-library service—the one corresponding to its own domain (e.g., `BeneficiaryFacadeService` injects `BeneficiaryService`).
         If it requires data from another domain, it must inject that domain's facade, not its service.

 Key Prohibitions (What it must NOT do):
     No Business Logic: Must not contain multi-step business workflows or complex orchestration. That logic belongs in the component.
     No View Transformations: Must not perform view-specific transformations like filtering a list for a specific page, sorting, or formatting data for display. It should expose raw data streams.
     No Direct Service Access for Components: Components must never bypass the facade to call a shared-library service directly.

 3. Components

This is the top-level layer responsible for user interaction, business logic orchestration, and preparing data for the template.

 Location: Application feature folders, such as `projects/client-app/src/app/features/user-space/beneficiairies/pages/...`.

 Core Responsibilities:
     Orchestration Hub: The component is the "brain" of the feature. It decides when to load data, save it, or refresh it by calling methods on one or more facades. It manages the entire lifecycle of a user flow.
     View-Specific Data Transformation: It is responsible for all logic needed to prepare data for its template. This includes:
         Combining streams from multiple facades (e.g., using `combineLatest` to merge user roles and beneficiary data).
         Filtering, sorting, and mapping raw data from facades into a final, tailored view-model (`view$`).
         Implementing all UI logic, such as managing ephemeral state with Angular Signals (e.g., dropdown visibility).
     Dependency Management: It injects the facades it needs to function. It must not inject shared-library services directly.

 Key Prohibitions (What it must NOT do):
     No DTO Knowledge: A component should not know about or build backend DTOs. It works with simple objects and relies on the facade for DTO conversion.
     No Caching or HTTP Logic: It should never contain API-calling or data-caching logic.

---

 Typical Data Flow Summary

This architecture creates a clear, unidirectional data flow for both reading and writing data.

1.  Read Flow (Component gets data):
     Component: Calls a facade method like `beneficiaryFacade.fetchBeneficiaries()`.
     Facade: Checks its cache. If data is stale, it proceeds. It sets its internal `loading` state to `true`.
     Facade: Calls the underlying `beneficiaryService.fetchMany(dto)`.
     Service: Makes the raw HTTP POST request to the backend API.
     Facade: On success, receives the raw DTO data, updates its internal `BehaviorSubject` with the new data, and sets `loading` to `false`.
     Component: Its template, subscribed to `beneficiaryFacade.beneficiaries$ | async`, automatically receives the new raw data and performs any necessary filtering/mapping before rendering.

2.  Write Flow (Component saves data):
     Component: Gathers data from a form into a simple object and calls a facade method like `beneficiaryFacade.deleteBeneficiary(request)`.
     Facade: Receives the simple object. It is responsible for mapping this object to the required `BeneficiaryRequest` DTO.
     Facade: Calls `beneficiaryService.remove(dto)`.
     Service: Makes the raw HTTP POST request.
     Facade: On success, it invalidates its own cache (`this.lastFetchTime = null`) so the next read will be fresh.
     Component: In the `subscribe` block of its call, it decides the next step, such as orchestrating a refresh (`this.beneficiaryFacade.fetchBeneficiaries(...)`) to update the UI.

