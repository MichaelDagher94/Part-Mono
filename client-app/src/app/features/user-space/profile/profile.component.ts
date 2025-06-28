import { Component, inject, signal } from "@angular/core";
import { ListMenuSidebarComponent } from "../../../../../../shared-library/src/lib/presentation/layout/list-menu-sidebar/list-menu-sidebar.component";
import { Router, RouterModule } from "@angular/router";

interface IMenu {
  id: string;
  label: string;
  isExpanded?: boolean;
  children?: IMenu[];
}

@Component({
  selector: "app-profile",
  imports: [ListMenuSidebarComponent, RouterModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
  //dependencies
  private router = inject(Router);

  //declarations
  menuItems = [
    { id: "1", label: "Données personnelles", path: "donnees-personnelles" },
    { id: "2", label: "Connexion et sécurité", path: "connexion-et-sécurite" },
    { id: "3", label: "Coordonnées bancaires", path: "coordonnées-bancaires" },
    { id: "4", label: "Télétransmission", path: "teletransmission" },
    { id: "5", label: "Mes documents", path: "mes-documents" },
    { id: "6", label: "Portabilité", path: "portabilite" },
    { id: "7", label: "Consentements", path: "consentements" },
  ];
  selectedMenu = signal<IMenu | null>(null);

  onMenuSelected(menuId: any) {
    const menu = this.menuItems.find(el => el.id == menuId);

    if (menu) {
      // this.selectedMenu.set(menu);
      this.redirectTo("mon-profil/" + menu.path);
    }
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }
}
