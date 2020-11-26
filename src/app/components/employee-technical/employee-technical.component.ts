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
import Swal from 'sweetalert2';

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
  selection: any = new SelectionModel<PeriodicElement>(true, []);

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

  addData() {
    Swal.mixin({
      title: 'Nuevo vehículo',
      showCancelButton: true,
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2', '3', '4', '5'],
    })
      .queue([
        {
          text: 'Placa',
          input: 'text',
          inputValidator: (value) => {
            if (!value) {
              return 'Es necesario escribir algo!';
            }
          },
        },
        {
          text: 'Marca',
          input: 'text',
          inputValidator: (value) => {
            if (!value) {
              return 'Es necesario escribir algo!';
            }
          },
        },
        {
          text: 'Modelo',
          input: 'text',
          inputValidator: (value) => {
            if (!value) {
              return 'Es necesario escribir algo!';
            }
          },
        },
        {
          text: 'Color',
          input: 'text',
          inputValidator: (value) => {
            if (!value) {
              return 'Es necesario escribir algo!';
            }
          },
        },
        {
          text: 'Estado',
          input: 'text',
          inputValidator: (value) => {
            if (!value) {
              return 'Es necesario escribir algo!';
            }
          },
        },
      ])
      .then((result: any) => {
        if (result.value) {
          this.dataSource.data.push({
            Placa: result.value[0],
            Marca: result.value[1],
            Modelo: result.value[2],
            Color: result.value[3],
            Estado: result.value[4],
          });
          return (this.dataSource.filter = '');
        }
      });
  }

  deleteData() {
    for (var j = 0; j < this.selection._selected.length; j++) {
      var i = this.dataSource.data.indexOf(this.selection._selected[j]);
      this.dataSource.data.splice(i, 1);
    }
    return (this.dataSource.filter = '');
  }

  delteThisRow(element) {
    var i = this.dataSource.data.indexOf(element);
    this.dataSource.data.splice(i, 1);
    return (this.dataSource.filter = '');
  }

  updateData(element) {
    Swal.mixin({
      title: 'Actualizar vehículo',
      showCancelButton: true,
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2', '3', '4', '5'],
    })
      .queue([
        {
          text: 'Placa',
          input: 'text',
        },
        {
          text: 'Marca',
          input: 'text',
        },
        {
          text: 'Modelo',
          input: 'text',
        },
        {
          text: 'Color',
          input: 'text',
        },
        {
          text: 'Estado',
          input: 'text',
        },
      ])
      .then((result: any) => {
        if (result.value) {
          if (
            !(
              !result.value[0] &&
              !result.value[1] &&
              !result.value[2] &&
              !result.value[3] &&
              !result.value[4]
            )
          ) {
            var data: any = {};
            if (result.value[0]) {
              data.Placa = result.value[0];
            } else {
              data.Placa = element.Placa;
            }
            if (result.value[1]) {
              data.Marca = result.value[1];
            } else {
              data.Marca = element.Marca;
            }
            if (result.value[2]) {
              data.Modelo = result.value[2];
            } else {
              data.Modelo = element.Modelo;
            }
            if (result.value[3]) {
              data.Color = result.value[3];
            } else {
              data.Color = element.Color;
            }
            if (result.value[4]) {
              data.Estado = result.value[4];
            } else {
              data.Estado = element.Estado;
            }

            var i = this.dataSource.data.indexOf(element);
            this.dataSource.data[i] = data;
            return (this.dataSource.filter = '');
          }
        }
      });
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
    Estado: 'Malo',
  },
  {
    Placa: 'h1',
    Marca: 'h1',
    Modelo: 'h1',
    Color: 'h1',
    Estado: 'h1',
  },
  {
    Placa: 'h6',
    Marca: 'h6',
    Modelo: 'h6',
    Color: 'h6',
    Estado: 'h6',
  },
];
