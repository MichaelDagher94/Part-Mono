import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Input,
  NgZone,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { CustomIconsBtnComponent } from "../../../../../../../shared-library/src/lib/presentation/layout/custom-icons-btn/custom-icons-btn.component";
import { getFrenchPaginatorIntl } from "../../../../../../../shared-library/src/lib/presentation/layout/custom-table/paginator/mat-paginator-intl-fr";
import { MyRefundsTableDetailsComponent } from "../../../../../../../shared-library/src/lib/presentation/layout/custom-table/table-details/myrefunds/my-refunds-table-details/my-refunds-table-details.component";
import { MatIconButton } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

interface GroupedRow {
  isGroup: boolean;
  groupName?: string;
  data?: any;
}

type RefundType = "health" | "foresight";

@Component({
  selector: "app-reimbursement-data-table",
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatIconButton,
    MatPaginator,
    MyRefundsTableDetailsComponent,
    CustomIconsBtnComponent,
    MatTooltipModule,
  ],
  templateUrl: "./reimbursement-data-table.component.html",
  styleUrl: "./reimbursement-data-table.component.scss",
  providers: [
    { provide: MatPaginatorIntl, useFactory: getFrenchPaginatorIntl },
  ],
})
export class ReimbursementDataTableComponent {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() currencyColumns: string[] = [];
  @Input() columnTitles: { [key: string]: string } = {};
  @Input() detailColumn: string = "remboursementsSanteDetail";
  @Input() showDownloadActions = true;
  @Input() showEditActions = true;
  @Input() showDeleteActions = true;
  @Input() showPagination: boolean = true;
  @Input() pageSize = 20;

  refundType = input<RefundType>("health");
  isSearch = input<boolean>(false);

  @Output() onDownload: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  private ngZone = inject(NgZone);

  pageSizeOption = [100000, 20, 50, 100];

  groupedRows: GroupedRow[] = [];
  emptyMsg = computed(() => {
    if (this.isSearch())
      return "Aucun règlement effectué correspondant à vos critères de recherche";
    switch (this.refundType()) {
      case "health":
        return "Aucun remboursement effectué au cours des 27 derniers mois";
      case "foresight":
        return "Aucun règlement effectué au cours des 27 derniers mois";
      default:
        return "Aucune donnée disponible";
    }
  });

  expandedElements: any[] = [];
  dataSource = new MatTableDataSource<any>();
  columnsToDisplayWithExpand = [...this.displayedColumns, "expand"];
  paginatedData: any[] = [];
  paginatedGroupedData: any[] = [];
  groupedData: {
    group: string;
    items: any[];
  }[] = [];

  groupedBy: string = "dateDeRemboursement";
  constructor(public _MatPaginatorIntl: MatPaginatorIntl) {
    this._MatPaginatorIntl.itemsPerPageLabel =
      "Afficher mes remboursements par";
    this._MatPaginatorIntl.getRangeLabel = (page, pageSize, length) => {
      if (pageSize >= length) {
        return `1 - ${length} sur ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, length);
      return `${startIndex + 1} - ${endIndex} sur ${length}`;
    };
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    if (
      !this.displayedColumns.includes("download") &&
      this.showDownloadActions
    ) {
      this.displayedColumns.push("download");
    }
    if (!this.displayedColumns.includes("actions")) {
      this.displayedColumns.push("actions");
    }
    this._MatPaginatorIntl.itemsPerPageLabel =
      "Afficher mes remboursements par";
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.page.subscribe(() => this.onPageChange());
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    this.displayShowAllPaginationOption();
  }

  displayShowAllPaginationOption() {
    this.onPageChange();
    this.ngZone.runOutsideAngular(() => {
      const observer = new MutationObserver(() => {
        const options = document.querySelectorAll(
          ".mat-mdc-option .mdc-list-item__primary-text"
        );
        options.forEach(option => {
          if (option.textContent?.trim() === "100000") {
            option.textContent = "VOIR TOUT";
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  onPageChange() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;

    // Pagination pour les données groupées
    let currentIndex = 0;
    this.paginatedGroupedData = [];

    for (const group of this.groupedData) {
      const groupSize = group.items.length + 1; // +1 pour inclure la ligne de groupe
      if (currentIndex >= endIndex) break;

      if (currentIndex + groupSize > startIndex) {
        this.paginatedGroupedData.push(group);
      }

      currentIndex += groupSize;
    }
  }

  toggleExpand(element: any): void {
    const index = this.expandedElements.indexOf(element);
    if (index > -1) {
      this.expandedElements.splice(index, 1); // Collapse
    } else {
      this.expandedElements.push(element); // Expand
    }
  }

  isExpanded(element: any): boolean {
    return this.expandedElements.includes(element);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] || changes["groupedBy"]) {
      if (this.groupedBy) {
        this.processData();
      } else {
        this.dataSource = new MatTableDataSource(this.data);
      }

      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    }
  }

  isCurrencyColumn(columnName: string): boolean {
    return this.currencyColumns.includes(columnName);
  }
  Number(value: any): number {
    if (typeof value == "number") return value;
    return parseFloat(value.replace(",", "."));
  }

  processData() {
    if (!this.groupedBy || !this.data) {
      this.groupedRows = this.data.map(item => ({
        isGroup: false,
        data: item,
      }));
      return;
    }
    const grouped: { [key: string]: any[] } = {};
    this.data.forEach(item => {
      const groupValue = item[this.groupedBy] || "Non groupé";
      if (!grouped[groupValue]) {
        grouped[groupValue] = [];
      }
      grouped[groupValue].push(item);
    });

    // Créer un tableau avec des lignes de groupe et des lignes de données
    this.groupedRows = [];
    Object.keys(grouped).forEach(key => {
      // Ajouter la ligne de groupe
      this.groupedRows.push({ isGroup: true, groupName: key });

      // Ajouter les lignes de données
      grouped[key].forEach(item => {
        this.groupedRows.push({ isGroup: false, data: item });
      });
    });
    this.dataSource = new MatTableDataSource(this.groupedRows);
    this.dataSource = new MatTableDataSource(this.groupedRows);
  }

  handleDownloadBtn(row: any) {
    this.onDownload.emit(row);
  }
  handleEditBtn(row: any) {
    this.onEdit.emit(row);
  }
  handleDeleteBtn(row: any) {
    this.onDelete.emit(row);
  }
}
