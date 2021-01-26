import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UpdateEmployeeRequests } from 'src/app/models/dataRequests/updateEmployee';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from 'src/app/models/vehicle';
import { OwnerDialog } from '../ownerDialog/owner-dialog';
import { ProfileDialog } from '../profile/profileDialog';

@Component({
  selector: 'app-employee-supervisor',
  templateUrl: './employee-supervisor.component.html',
  styleUrls: ['./employee-supervisor.component.scss'],
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
export class EmployeeSupervisorComponent implements OnInit {
  userEmployee: Employee;
  name = sessionStorage.getItem('name');
  states: any[] = [];
  vehicleTypes: any[] = [];
  Vehicles: Vehicle[] = [];
  employees: any[] = [];
  owners: any[] = [];

  dataSource: MatTableDataSource<Vehicle> = null;
  columnsToDisplay: string[] = [
    'plate',
    'brand',
    'model',
    'propietario',
    'mecanico',
  ];
  expandedElement: Vehicle | null;

  async ngOnInit(): Promise<void> {
    const email = sessionStorage.getItem('email');
    if (email) {
      await this.employeeService.getEmployee(email).then(
        (user: any) => {
          user = JSON.parse(user);
          if (user.role.name === 'supervisor') {
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
          this.errorService();
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

    this.APIVehicle.getStates().then(
      (data) => {
        if (data) {
          data = JSON.parse(data);
          if (data.length > 0) {
            this.states = data;
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
    this.APIVehicle.getEmployees().then(
      (data) => {
        if (data) {
          data = JSON.parse(data);
          if (data.length > 0) {
            this.employees = data;
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
    this.APIVehicle.getOwners().then(
      (data) => {
        if (data) {
          data = JSON.parse(data);
          if (data.length > 0) {
            this.owners = data;
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
    this.APIVehicle.getVehicleTypes().then(
      (data) => {
        if (data) {
          data = JSON.parse(data);
          if (data.length > 0) {
            this.vehicleTypes = data;
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
    this.APIVehicle.getVehicles().then(
      (data) => {
        if (data) {
          data = JSON.parse(data);
          if (data.length > 0) {
            this.Vehicles = data;
            this.addOwners(data);
            this.addThechnic(data);
            this.dataSource = new MatTableDataSource(this.Vehicles);
            this.dataSource.filter = '';
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addOwners(data) {
    for (let index = 0; index < this.Vehicles.length; index++) {
      this.APIVehicle.getOwnerByVehiclesId(this.Vehicles[index].id).then(
        (data) => {
          if (data) {
            data = JSON.parse(data);
            this.Vehicles[index]['nameOwner'] = data.owner.name;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  addThechnic(data) {
    for (let index = 0; index < this.Vehicles.length; index++) {
      this.APIVehicle.getTechnicalByVehiclesId(this.Vehicles[index].id).then(
        (data) => {
          if (data) {
            data = JSON.parse(data);
            this.searchNameTechinal(index, data.mechanicalId);
          } else {
            this.Vehicles[index]['nameTechnic'] = 'No tiene';
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  gestionaPropietario() {
    const dialogRef = this.dialogSource.open(OwnerDialog, {
      height: '100%',
      width: '99.9%',
    });
  }

  searchNameTechinal(index, id) {
    this.employees.forEach((element) => {
      if (element.id == id) {
        this.Vehicles[index]['nameTechnic'] = element.name;
      }
    });
  }

  searchNameTechinalById(id) {
    console.log(this.employees);
    console.log('-----------');
    console.log(id);
  }

  searchNameOwnerById(id) {
    this.owners.forEach((element) => {
      if (element.id == id) {
        return element.name;
      }
    });
  }

  errorService() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ha ocurrido un problema en el servidor!',
      showConfirmButton: true,
      confirmButtonColor: '#34c4b7',
    });
  }

  profile() {
    this.openProfileDialog(this.userEmployee);
  }

  openProfileDialog(employee: Employee) {
    const id = employee.id;
    const dialogRef = this.employeeDialog.open(ProfileDialog, {
      data: { employee: employee },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateEmployee(id, result.employee);
      }
    });
  }

  async updateEmployee(id: number, updateEmployee: UpdateEmployeeRequests) {
    return this.employeeService.updateEmployee(id, updateEmployee).then(
      async (data) => {
        if (data) {
          data = JSON.parse(data);
          Swal.fire({
            icon: 'success',
            title: 'Información del empleado actualizada correctamente.',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          });
        }
      },
      (error) => {
        console.error(error);
      }
    );
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

  updateData(element) {
    Swal.fire({
      title: 'Actualizar vehículo',
      input: 'select',
      inputOptions: this.getStates(),
      inputPlaceholder: 'Seleccionar un estado',
      showCancelButton: true,
      inputValidator: (value) => {
        if (value == '') {
          return 'Debes elegir una opción';
        }
      },
    }).then((result: any) => {
      if (result.value) {
        var newVehicle = {
          plate: element.plate,
          brand: element.brand,
          model: element.model,
          color: element.color,
          vehicleTypeId: element.vehicleType.id,
          stateId: result.value,
        };
        element.state = this.getStateById(result.value);
        this.APIVehicle.updateVehicle(element.id, newVehicle).then(
          (result) => {
            if (result) {
              result = JSON.parse(result);
              var i = this.dataSource.data.indexOf(element);
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

  getStateById(id: string) {
    for (let index = 0; index < this.states.length; index++) {
      if (this.states[index].id == id) {
        return this.states[index];
      }
    }
  }

  getStates() {
    var estados = {};
    for (let index = 3; index < this.states.length; index++) {
      estados[this.states[index].id] = this.states[index].name;
    }
    return estados;
  }

  selectOwner(element) {
    Swal.fire({
      title: 'Asociar Propietario',
      input: 'select',
      inputOptions: this.getOwners(),
      inputPlaceholder: 'Seleccionar un propietario',
      showCancelButton: true,
      inputValidator: (value) => {
        if (value == '') {
          return 'Debes elegir una opción';
        }
      },
    }).then((result: any) => {
      if (result.value) {
        var vehicleXOwner = {
          vehicleId: element.id,
          ownerId: result.value,
        };
        this.APIVehicle.vehicleXOwner(vehicleXOwner).then(
          (r) => {
            if (r) {
              r = JSON.parse(r);
              this.owners.forEach((elementAux) => {
                if (elementAux.id == vehicleXOwner.ownerId) {
                  element.nameOwner = elementAux.name;
                }
              });
            }
          },
          (error) => {
            console.error(error);
          }
        );
      }
    });
  }

  getOwners() {
    var owners = {};
    for (let index = 0; index < this.owners.length; index++) {
      owners[this.owners[index].id] = this.owners[index].name;
    }
    return owners;
  }

  selectTechnical(element) {
    Swal.fire({
      title: 'Asociar Mecánico',
      input: 'select',
      inputOptions: this.getTechnicals(),
      inputPlaceholder: 'Seleccionar un Mecánico',
      showCancelButton: true,
      inputValidator: (value) => {
        if (value == '') {
          return 'Debes elegir una opción';
        }
      },
    }).then((result: any) => {
      if (result.value) {
        var vehicleStates = {
          stateId: element.state.id,
          vehicleId: element.id,
          mechanicalId: result.value,
        };
        this.APIVehicle.vehicleXTechnical(vehicleStates).then(
          (r) => {
            r = JSON.parse(r);
            this.employees.forEach((elementAux) => {
              if (elementAux.id == vehicleStates.mechanicalId) {
                element.nameTechnic = elementAux.name;
              }
            });
          },
          (error) => {
            console.error(error);
          }
        );
      }
    });
  }

  getTechnicals() {
    var technicals = {};
    for (let index = 0; index < this.employees.length; index++) {
      if (this.employees[index].roleId == 2) {
        technicals[this.employees[index].id] = this.employees[index].name;
      }
    }
    return technicals;
  }

  constructor(
    public dialogSource: MatDialog,
    private APIVehicle: VehicleService,
    // private employeeService: EmployeeService,
    private router: Router,
    public employeeDialog: MatDialog,
    private employeeService: EmployeeService
  ) {}
}
