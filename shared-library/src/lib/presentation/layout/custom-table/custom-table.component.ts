import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  input,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { CustomIconsBtnComponent } from "../custom-icons-btn/custom-icons-btn.component";
import { getFrenchPaginatorIntl } from "./paginator/mat-paginator-intl-fr";
import { BeneficiaryTableDetailsComponent } from "./table-details/beneficiary/beneficiary-table-details/beneficiary-table-details.component";

interface GroupedRow {
  isGroup: boolean;
  groupName?: string;
  data?: any;
}

@Component({
  selector: "lib-custom-table",
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginator,
    MatSortModule,
    MatIconModule,
    MatIconButton,
    BeneficiaryTableDetailsComponent,
    CustomIconsBtnComponent,
  ],
  templateUrl: "./custom-table.component.html",
  styleUrl: "./custom-table.component.scss",
  providers: [
    { provide: MatPaginatorIntl, useFactory: getFrenchPaginatorIntl },
  ],
})
export class CustomTableComponent {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() pageSize = 10;
  @Input() columnTitles: { [key: string]: string } = {};
  @Input() title = "";
  @Input() detailColumn: string = "";
  @Input() groupedBy: string = "";
  @Input() showPagination: boolean = true;
  @Input() showDownloadActions = true;
  @Input() showEditActions = true;
  @Input() showDeleteActions = true;
  @Input() isFromSanteListe = false;
  dataType = input<any>("beneficiary");
  emptyMsg = input<string>("Vous n'avez aucun bénéficiaire actif");

  @Output() onDownload: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  groupedRows: GroupedRow[] = [];

  expandedElements = new Set<any>();

  dataSource = new MatTableDataSource<any>();
  columnsToDisplayWithExpand = [...this.displayedColumns, "expand"];

  pageIndex = 0;
  pageSizeOptions = [20, 50, 100];

  paginatedData: any[] = [];
  paginatedGroupedData: any[] = [];

  constructor(public _MatPaginatorIntl: MatPaginatorIntl) {}

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

    this.onPageChange();
  }

  onPageChange() {
    if (!this.paginator) return;

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.paginatedData = this.data.slice(startIndex, endIndex);
    this.dataSource.data = this.paginatedData;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      this.dataSource.data = this.data;
    }
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  toggleRow(row: any): void {
    if (row.isGroup) return;

    if (this.expandedElements.has(row)) {
      this.expandedElements.delete(row);
    } else {
      this.expandedElements.add(row);
    }
  }

  isExpanded(element: any): boolean {
    return this.expandedElements.has(element);
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

  detailEdithandle(row: any) {
    this.onEdit.emit(row);
  }
}
