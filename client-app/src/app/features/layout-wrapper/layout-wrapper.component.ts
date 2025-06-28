import { Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { BreadcrumbComponent } from "xng-breadcrumb";
import { DashboardBannerComponent } from "../../../../../shared-library/src/lib/components/dashboard-banner/dashboard-banner.component";
import { HeaderComponent } from "../../../../../shared-library/src/lib/presentation/layout/client/header/header.component";
import { PreHeaderComponent } from "../../../../../shared-library/src/lib/presentation/layout/client/pre-header/pre-header.component";
import { FooterComponent } from "../../../../../shared-library/src/lib/presentation/layout/footer/footer.component";
import { MenuBannerComponent } from "../../../../../shared-library/src/lib/presentation/layout/menu-banner/menu-banner.component";
import { LoaderComponent } from "../../../../../shared-library/src/lib/presentation/ui-elements/loader/loader.component";
import { AuthenticationFacadeService } from "../../core/services/authentication/authentication-facade.service";
import { LayoutFacadeService } from "./layout-facade/layout-facade.service";

@Component({
  selector: "app-layout-wrapper",
  imports: [
    RouterOutlet,
    HeaderComponent,
    MenuBannerComponent,
    FooterComponent,
    BreadcrumbComponent,
    PreHeaderComponent,
    LoaderComponent,
    DashboardBannerComponent,
  ],
  templateUrl: "./layout-wrapper.component.html",
  styleUrl: "./layout-wrapper.component.scss",
})
export class LayoutWrapperComponent {
  //dependencies
  authFacade = inject(AuthenticationFacadeService);
  router = inject(Router);
  layoutFacade = inject(LayoutFacadeService);

  currentParticipant$ = new BehaviorSubject<any>(null);

  isDashboardRoute(): boolean {
    // Vérifie "/" ou "/?sessionData=..."
    const url = this.router.url.split("?")[0];
    return url === "/";
  }

  ngOnInit() {
    this.layoutFacade.getCurrentParticipant().subscribe(participant => {
      this.currentParticipant$.next(participant);
    });
  }

  logoHandle() {
    this.router.navigate(["/dashboard"]);
  }

  logoutHandle() {
    this.authFacade.logout();
    window.location.href = "/";
  }
}
