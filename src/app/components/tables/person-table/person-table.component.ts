import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { Person } from '@interfaces/entity';
import { PaginationResponse } from '@interfaces/pagination';

import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-person-table',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    PaginationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './person-table.component.html',
  styleUrl: './person-table.component.scss',
})
export class PersonTableComponent implements OnInit, OnChanges {
  @Input() personPaginatedList!: PaginationResponse<Person>;
  @Input() searchValue?: string;
  @Output() selectedPerson = new EventEmitter<Person>();
  @Output() pageEvent = new EventEmitter<PageEvent>();

  dataSource = new MatTableDataSource<Person>();

  displayedColumns: string[] = ['fullName', 'active', 'cpf', 'cnpj'];
  pageSizeOptions = [1000, 100, 50, 20];
  filteredData: Person[] = [];

  ngAfterViewInit() {}

  ngOnInit(): void {
    if (this.personPaginatedList?.content) {
      this.dataSource.data = this.personPaginatedList.content;
    }
  }

  ngOnChanges() {
    this.filteringData();
  }

  filteringData() {
    if (this.searchValue?.length) {
      this.filteredData = this.personPaginatedList.content.filter((element) => {
        if (element.person.fullName || element.person.legalName) {
          return (element.person.fullName || element.person.legalName)
            .trim()
            .toLowerCase()
            .includes(this.searchValue!.trim().toLowerCase());
        } else return false;
      });
      this.dataSource.data = this.filteredData;
    } else {
      this.dataSource.data = this.personPaginatedList.content;
    }
  }

  onRowClick(row: Person) {
    this.selectedPerson.emit(row);
  }

  handlePageEvent(event: PageEvent) {
    this.pageEvent.emit(event);
  }
}
