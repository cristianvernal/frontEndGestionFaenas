import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

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
  ],
  templateUrl: './ui-table.component.html',
  styleUrl: './ui-table.component.css',
})
export class UiTableComponent<T> implements OnChanges, AfterViewInit {
  dataSource = new MatTableDataSource<T>([]);
  data = input<T[]>([]);
  columns = input<tableColumn<T>[]>([]);
  displayedColumns = computed(() => this.columns().map((col) => col.def));
  matSort = viewChild.required(MatSort)
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue) {
      this.setData();
    }
  }
  private setData() {
    this.dataSource.data = this.data();
  }
}
