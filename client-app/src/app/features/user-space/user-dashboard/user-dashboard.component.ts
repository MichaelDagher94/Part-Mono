import { Component } from "@angular/core";
import { DbActualityComponent } from "./child/db-actuality/db-actuality.component";
import { DbShortcutComponent } from "./child/db-shortcut/db-shortcut.component";
import { DbRefundsTabComponent } from "./child/db-refunds-tab/db-refunds-tab.component";

@Component({
  selector: "app-user-dashboard",
  imports: [DbActualityComponent, DbShortcutComponent, DbRefundsTabComponent],
  templateUrl: "./user-dashboard.component.html",
  styleUrl: "./user-dashboard.component.scss",
})
export class UserDashboardComponent {}
