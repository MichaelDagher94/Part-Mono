import { Component } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router } from "@angular/router";

@Component({
  selector: "lib-menu-banner",
  imports: [MatToolbarModule],
  templateUrl: "./menu-banner.component.html",
  styleUrl: "./menu-banner.component.scss",
})
export class MenuBannerComponent {
  menuList = [
    { label: "Mes remboursements", path: "mes-remboursements", isActive: true },
    { label: "Mes cartes TP", path: "mes-cartes-tp" },
    { label: "Mes démarches", path: "mes-demarches" },
    { label: "Mes garanties", path: "mes-garanties" },
    { label: "Mes services", path: "" },
    { label: "Mes bénéficiaires", path: "mes-beneficiaires" },
    { label: "Mon profil", path: "mon-profil/donnees-personnelles" },
  ];

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    if (!path) return false;
    const currentUrl = this.router.url;
    return currentUrl.includes(path);
  }

  // Navigation au clic
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
