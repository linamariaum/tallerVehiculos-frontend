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
import { Vehicle } from 'src/app/models/vehicle';
import { VehicleService } from 'src/app/services/vehicle.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialog } from '../profile/profileDialog';
import { UpdateEmployeeRequests } from 'src/app/models/dataRequests/updateEmployee';

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
  userEmployee: Employee;
  name = sessionStorage.getItem('name');
  states: any[] = [];
  vehicleTypes: any[] = [];
  Vehicles: Vehicle[] = [];

  dataSource: MatTableDataSource<Vehicle> = null;
  columnsToDisplay: string[] = ['select', 'plate', 'brand', 'model', 'color'];
  expandedElement: Vehicle | null;
  selection: any = new SelectionModel<Vehicle>(true, []);

  profile() {
    this.openProfileDialog(this.userEmployee);
  }

  openProfileDialog(employee: Employee) {
    const id = employee.id;
    const dialogRef = this.employeeDialog.open(ProfileDialog, {
      data: { employee: employee}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateEmployee(id, result.employee);
      }
    });
  }

  async updateEmployee(id: number, updateEmployee: UpdateEmployeeRequests) {
    return this.employeeService.updateEmployee(id, updateEmployee). then(
      async (data) => {
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Información del empleado actualizada correctamente.',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7'
          });
        }
      }, (error) => {
        console.error(error);
      }
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Vehicle): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.plate
    }`;
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
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
      progressSteps: ['1', '2', '3', '4', '5', '6'],
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
          input: 'select',
          inputOptions: this.getStates(),
          inputPlaceholder: 'Seleccionar un estado',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Es necesario elegir algo!';
            }
          },
        },
        {
          text: 'Tipo de vehículo',
          input: 'select',
          inputOptions: this.getVehicleTypes(),
          inputPlaceholder: 'Seleccionar un tipo de vehículo',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Es necesario elegir algo!';
            }
          },
        },
      ])
      .then((result: any) => {
        if (result.value) {
          var newVehicle: any = {
            plate: result.value[0],
            brand: result.value[1],
            model: result.value[2],
            color: result.value[3],
            vehicleTypeId: result.value[5],
            stateId: result.value[4],
          };
          this.APIVehicle.createVehicle(newVehicle).then(
            (data) => {
              if (data && data.length > 0) {
                var response: any = {
                  plate: result.value[0],
                  brand: result.value[1],
                  model: result.value[2],
                  color: result.value[3],
                  vehicleType: this.getVehicleTypeById(
                    JSON.parse(data).vehicleTypeId
                  ),
                  state: this.getStateById(JSON.parse(data).stateId),
                  id: JSON.parse(data).id,
                };
                this.dataSource.data.push(response);
                return (this.dataSource.filter = '');
              }
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
  }

  getStates() {
    var estados = {};
    for (let index = 0; index < this.states.length; index++) {
      estados[this.states[index].id] = this.states[index].name;
    }
    return estados;
  }

  getVehicleTypes() {
    var estados = {};
    for (let index = 0; index < this.vehicleTypes.length; index++) {
      estados[this.vehicleTypes[index].id] = this.vehicleTypes[index].name;
    }
    return estados;
  }

  deleteData() {
    for (var j = 0; j < this.selection._selected.length; j++) {
      this.delteThisRow(this.selection._selected[j]);
    }
  }

  delteThisRow(element) {
    this.APIVehicle.deleteVehicle(element.id).then(
      (data) => {
        if (data) {
          var i = this.dataSource.data.indexOf(element);
          this.dataSource.data.splice(i, 1);
          return (this.dataSource.filter = '');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateData(element) {
    Swal.mixin({
      title: 'Actualizar vehículo',
      showCancelButton: true,
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2', '3', '4', '5', '6'],
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
          input: 'select',
          inputOptions: this.getStates(),
          inputPlaceholder: 'Seleccionar un estado',
        },
        {
          text: 'Tipo de vehículo',
          input: 'select',
          inputOptions: this.getVehicleTypes(),
          inputPlaceholder: 'Seleccionar un tipo de vehículo',
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
              !result.value[4] &&
              !result.value[5]
            )
          ) {
            var data: any = {};
            if (result.value[0]) {
              data.plate = result.value[0];
            } else {
              data.plate = element.plate;
            }
            if (result.value[1]) {
              data.brand = result.value[1];
            } else {
              data.brand = element.brand;
            }
            if (result.value[2]) {
              data.model = result.value[2];
            } else {
              data.model = element.model;
            }
            if (result.value[3]) {
              data.color = result.value[3];
            } else {
              data.color = element.color;
            }
            if (result.value[4]) {
              data.state = this.getStateById(result.value[4]);
            } else {
              data.state = element.state;
            }
            if (result.value[5]) {
              data.vehicleType = this.getVehicleTypeById(result.value[5]);
            } else {
              data.vehicleType = element.vehicleType;
            }
            data.id = element.id;

            var newVehicle = {
              plate: data.plate,
              brand: data.brand,
              model: data.model,
              color: data.color,
              vehicleTypeId: data.vehicleType.id,
              stateId: data.state.id,
            };
            this.APIVehicle.updateVehicle(data.id, newVehicle).then(
              (result) => {
                if (result) {
                  var i = this.dataSource.data.indexOf(element);
                  this.dataSource.data[i] = data;
                  return (this.dataSource.filter = '');
                }
              },
              (error) => {
                console.error(error);
              }
            );
          }
        }
      });
  }

  getStateById(id: string) {
    for (let index = 0; index < this.states.length; index++) {
      if (this.states[index].id == id) {
        return this.states[index];
      }
    }
  }

  getVehicleTypeById(id: string) {
    for (let index = 0; index < this.vehicleTypes.length; index++) {
      if (this.vehicleTypes[index].id == id) {
        return this.vehicleTypes[index];
      }
    }
  }

  constructor(
    private APIVehicle: VehicleService,
    // private employeeService: EmployeeService,
    private router: Router,
    public employeeDialog: MatDialog,
    private employeeService: EmployeeService
  ) {}

  async ngOnInit(): Promise<void> {
    const email = sessionStorage.getItem('email');
    if (email) {
      (await this.employeeService.getEmployee(email)).subscribe(
        (user: Employee) => {
          if (user.role.name === 'Mecánico') {
            this.userEmployee = user;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text:
                'No tiene permiso para acceder a este recurso! Redireccionando',
              showConfirmButton: true,
              confirmButtonColor: '#34c4b7',
            });
            this.router.navigate(['/homepage']);
          }
        },
        (error) => {
          console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ha ocurrido un error. Intente más tarde. ',
              showConfirmButton: true,
              confirmButtonColor: '#34c4b7',
            });
          this.router.navigate(['/homepage']);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No tiene permiso para acceder a este recurso! Redireccionando',
        showConfirmButton: true,
        confirmButtonColor: '#34c4b7',
      });
      this.router.navigate(['/homepage']);
    }
    this.APIVehicle.getVehicles().then(
      (data) => {
        if (data && data.length > 0) {
          this.Vehicles = data;
          this.dataSource = new MatTableDataSource(this.Vehicles);
          this.dataSource.filter = '';
        }
      },
      (error) => {
        console.error(error);
      }
    );
    this.APIVehicle.getStates().then(
      (data) => {
        if (data && data.length > 0) {
          this.states = data;
        }
      },
      (error) => {
        console.error(error);
      }
    );
    this.APIVehicle.getVehicleTypes().then(
      (data) => {
        if (data && data.length > 0) {
          this.vehicleTypes = data;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
