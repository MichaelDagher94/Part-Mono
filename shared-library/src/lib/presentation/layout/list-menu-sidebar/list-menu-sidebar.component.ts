import { Component, Input, input, output } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

interface IMenu {
  id: string;
  label: string;
  isExpanded?: boolean;
  children?: IMenu[];
}

@Component({
  selector: "lib-list-menu-sidebar",
  imports: [MatListModule, MatExpansionModule, MatIconModule],
  templateUrl: "./list-menu-sidebar.component.html",
  styleUrl: "./list-menu-sidebar.component.scss",
})
export class ListMenuSidebarComponent {
  @Input() selectedItem = "1";
  onItemSelected = output<number>();
  items = input<IMenu[]>([]);

  selectItem(item: any): void {
    if (!item.children) {
      this.selectedItem = item.id;
      this.onItemSelected.emit(item.id);
    }
  }

  toggleChildren(item: any): void {
    this.selectItem(item);
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    } else {
      this.selectedItem = item.id;
      this.onItemSelected.emit(item.id);
    }
  }

  selectChild(child: any): void {
    this.selectedItem = child.id;
    this.onItemSelected.emit(child.id);
  }
}
