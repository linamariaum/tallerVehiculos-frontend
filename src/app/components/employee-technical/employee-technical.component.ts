import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-employee-technical',
  templateUrl: './employee-technical.component.html',
  styleUrls: ['./employee-technical.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class EmployeeTechnicalComponent implements AfterViewInit, OnInit {
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay: string[] = ['select', 'Placa', 'Marca', 'Modelo', 'Color'];
  expandedElement: PeriodicElement | null;
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.Placa
    }`;
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor() {}

  ngOnInit(): void {}
}

export interface PeriodicElement {
  Placa: string;
  Marca: string;
  Modelo: string;
  Color: string;
  Estado: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Placa: 'MMI132',
    Marca: 'Tesla',
    Modelo: '2001',
    Color: 'Blanco',
    Estado: `Malo`,
  },
  {
    Placa: 'h1',
    Marca: 'h1',
    Modelo: 'h1',
    Color: 'h1',
    Estado: `h1`,
  },
  {
    Placa: 'h2',
    Marca: 'h2',
    Modelo: 'h2',
    Color: 'h2',
    Estado: `h2`,
  },
  {
    Placa: 'h3',
    Marca: 'h3',
    Modelo: 'h3',
    Color: 'h3',
    Estado: `h3`,
  },
  {
    Placa: 'h4',
    Marca: 'h4',
    Modelo: 'h4',
    Color: 'h4',
    Estado: `h4`,
  },
  {
    Placa: 'h5',
    Marca: 'h5',
    Modelo: 'h5',
    Color: 'h5',
    Estado: `h5`,
  },
  {
    Placa: 'h6',
    Marca: 'h6',
    Modelo: 'h6',
    Color: 'h6',
    Estado: `h6`,
  },
  {
    Placa: 'h7',
    Marca: 'h7',
    Modelo: 'h7',
    Color: 'h7',
    Estado: `h7`,
  },
  {
    Placa: 'h8',
    Marca: 'h8',
    Modelo: 'h8',
    Color: 'h8',
    Estado: `h8`,
  },
  {
    Placa: 'h9',
    Marca: 'h9',
    Modelo: 'h9',
    Color: 'h9',
    Estado: `h9`,
  },
];
