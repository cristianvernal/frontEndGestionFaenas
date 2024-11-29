import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  EventEmitter,
  input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  viewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

export interface tableColumn<T> {
  label: string;
  def: string;
  content?: (row: T) => string | null | undefined;
  template?: TemplateRef<unknown>;
  isSortable?: boolean;
}

@Component({
  selector: 'app-ui-table',
  standalone: true,
  imports: [
    MatTableModule,
    NgTemplateOutlet,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
  ],
  templateUrl: './ui-table.component.html',
  styleUrl: './ui-table.component.css',
})
export class UiTableComponent<T> implements OnChanges, AfterViewInit {
  dataSource = new MatTableDataSource<T>([]);
  data = input<T[]>([]);
  columns = input<tableColumn<T>[]>([]);
  displayedColumns = computed(() => ['select', ...this.columns().map((col) => col.def)]);
  matSort = viewChild.required(MatSort);
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort();
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue) {
      this.setData();
    }
  }

  private setData() {
    this.dataSource.data = this.data();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  @Output() select: EventEmitter<any> = new EventEmitter()

  onSelect() {
    this.select.emit(this.selection.selected)
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.onSelect();
      return;
    }

    this.selection.select(...this.dataSource.data);
    this.onSelect()
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
}
