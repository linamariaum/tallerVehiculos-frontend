import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { Employee } from 'src/app/models/employee';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Role } from 'src/app/models/role';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialog } from './employeeDialog';
import { NewEmployeeRequests } from 'src/app/models/dataRequests/newEmployee';
import { UpdateEmployeeRequests } from 'src/app/models/dataRequests/updateEmployee';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileDialog } from '../profile/profileDialog';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-employee-assistant',
  templateUrl: './employee-assistant.component.html',
  styleUrls: ['./employee-assistant.component.scss'],
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
export class EmployeeAssistantComponent implements OnInit {
    userEmployee: Employee = {
      id: 6,
      password: 'MMI132',
      name: 'Asis Perez',
      registryDate: '2001',
      email: 'asis@email.com',
      removalDate: 'Malo',
      cellphone: '2342342376',
      role: {
        id: 1,
        name: 'Asistente de gerencia'
      }
    };
    employees: Employee[];
    dataSource: MatTableDataSource<Employee>;
    columnsToDisplay: string[] = ['select', 'name', 'email', 'cellphone', 'role'];
    expandedElement: Employee | null;
    selection: any = new SelectionModel<Employee>(true, []);
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    spinner: boolean = true;
    control: FormGroup;
    roles: Role[] = [
      { id: 1, name: 'Asistente de gerencia' },
      { id: 2, name: 'Supervisor' },
      { id: 3, name: 'Técnico' }
    ];
    sub: Subscription;

  constructor(private formBuilder: FormBuilder, private employeeService: EmployeeService, public employeeDialog: MatDialog,
    private route: ActivatedRoute, private router: Router, private roleService: RoleService) { }

  async ngOnInit() {

    // INICIO COSA DESECHABLE
    const prueba = 0;
    sessionStorage.setItem('id', prueba.toString());
    // FIN COSA DESECHABLE

    this.sub = this.route.params.subscribe(async params => {
      const id = params['id'];
      if (id && id === sessionStorage.getItem('id')) {
        this.roleService.getAll().subscribe(data => {
          const datos = data;
          this.roles = datos;
        });
    //     (await this.employeeService.getEmployee(id)).subscribe((user: Employee) => {
    //       if (user) {
    //         this.userEmployee = user;
    //       } else {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Oops...',
    //           text: 'No tiene permiso para acceder a este recurso! Redireccionando',
    //           showConfirmButton: true,
    //           confirmButtonColor: '#34c4b7',
    //         });
    //         this.router.navigate(['/homepage']);
    //       }
    //     }, error => {
    //       console.error(error)
    //       this.errorService();
    //       this.router.navigate(['/homepage']);
    //     });

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
    });
    this.control = this.formBuilder.group({
      controlRole: ['']
    });
    await this.loadEmployees();
    this.init(this.employees);
    this.onChanges();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  init(datos: Employee[]) {
    this.dataSource = new MatTableDataSource(datos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Items por página';
  }

  onChanges() {
    this.control.get('controlRole').valueChanges.subscribe(
      selectedRole => {
        if(selectedRole != '0') {
          let employeeFilter = this.searchEmployeeByRole(selectedRole);
          if (employeeFilter.length > 0) {
            this.init(employeeFilter);
          } else {
            Swal.fire({
              title: `No se encontraron empleados para el cargo ${this.searchNameByRole(selectedRole)}`,
              confirmButtonColor: '#34c4b7'
            });
          }
        } else {
          // Renderiza todos los empleados
          this.init(this.employees);
        }
      }
    );
  }

  searchEmployeeByRole(idRole: number): Employee[] {
    let employeesFilter: Employee[] = [];
    this.employees.forEach(element => {
      if (element.role.id === idRole) {
        employeesFilter.push(element);
      }
    });
    return employeesFilter;
  }

  searchNameByRole(idRole: string): string {
    const id = +idRole;
    let name = '';
    this.roles.forEach(element => {
      if (element.id === id) {
        name = element.name;
      }
    });
    return name;
  }

  async loadEmployees() {
    return this.employeeService.getAllEmployees().then(
      (data) => {
        if (data && data.length > 0) {
          this.employees = data;
          this.spinner = false;
        }
      }, (error) => {
        console.error(error);
        this.employees = [
          {
            id: 1,
            password: 'MMI132',
            name: 'Tesla Perez',
            registryDate: '2001',
            email: 'tesla@email.com',
            removalDate: 'Malo',
            cellphone: '2342342376',
            role: {
              id: 3,
              name: 'Tecnico'
            }
          },
          {
            id: 4,
            password: 'h1',
            name: 'Tisla Perez',
            registryDate: '2020',
            email: 'tisla@email.com',
            removalDate: 'h1',
            cellphone: '2343434236',
            role: {
              id: 2,
              name: 'Supervisor'
            }
          },
          {
            id: 11,
            password: 'h6',
            name: 'Tusla Perez',
            registryDate: '2020',
            email: 'tuslaPerez@email.com',
            removalDate: 'h6',
            cellphone: '2345678834',
            role: {
              id: 3,
              name: 'Tecnico'
            }
          },
        ];
        this.spinner = false;
        this.errorService();
      }
    );
  }

  profile() {
    this.openProfileDialog(this.userEmployee);
  }

  openProfileDialog(employee: Employee) {
    const dialogRef = this.employeeDialog.open(ProfileDialog, {
      data: { employee: employee}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result.employee); // COSA DESECHABLE
        this.spinner = true;
        this.updateEmployee(result.employee);
      }
    });
  }

  add() {
    let empl: NewEmployeeRequests = {
      password: '',
      name: '',
      email: '',
      cellphone: '',
      roleId: 0
    };
    this.openDialog(empl, 'create');
  }

  update(employee) {
    this.openDialog(employee, 'update');
  }

  openDialog(employee: any, type: string) {
    const dialogRef = this.employeeDialog.open(EmployeeDialog, {
      data: { employee: employee, type: type}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result.employee) // COSA DESECHABLE
        if (result.type === 'create') {
          this.spinner = true;
          this.createEmployee(result.employee);
        } else if ( result.type === 'update') {
          this.spinner = true;
          this.updateEmployee(result.employee);
        }
      }
    });
  }

  async createEmployee(newEmployee: NewEmployeeRequests) {
    return this.employeeService.createEmployee(newEmployee).then(
      async (data) => {
        if (data && data.length > 0) { // COSA
          Swal.fire({
            icon: 'success',
            title: `Empleado agregado exitosamente.`,
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7'
          });
          await this.loadEmployees();
          this.init(this.employees);
        }
      }, (error) => {
        console.error(error);
        this.errorService();
        this.spinner = false;
      }
    );
  }

  async updateEmployee(updateEmployee: UpdateEmployeeRequests) {
    return this.employeeService.updateEmployee(updateEmployee). then(
      async (data) => {
        if (data && data.length > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Información del empleado actualizada correctamente.',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7'
          });
          await this.loadEmployees();
          this.init(this.employees);
        }
      }, (error) => {
        console.error(error);
        this.errorService();
        this.spinner = false;
      }
    );
  }


  remove(employee) {
    Swal.fire({
      title: `¿Eliminar empleado ${employee.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c4b7',
      cancelButtonColor: '#2b6f54',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        // Desvincular los autos o tecnicos asociados (?)
        // Eliminar
        (await this.employeeService.removeEmployee(employee.id)).subscribe(result => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado!',
            showConfirmButton: false,
            timer: 1500
          });
          const index: number = this.employees.indexOf(this.searchEmployeeById(employee.id));
          if (index !== -1) {
              this.employees.splice(index, 1);
          }
          this.init(this.employees);
        }, (error) => {
          console.error(error);
          this.errorService();
          // COSA INICIO DESECHABLE
          const index: number = this.employees.indexOf(this.searchEmployeeById(employee.id));
            if (index !== -1) {
                this.employees.splice(index, 1);
            }
          this.init(this.employees);
          // COSA FIN DESECHABLE
        });
      }
    });
  }

  getSelectedEmployees(): any[] {
    return [...this.selection.selected];
  }

  deleteSelectedEmployees() {
    const employeesToDelete = this.getSelectedEmployees();
    Swal.fire({
      title: '¿Eliminar empleados seleccionados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c4b7',
      cancelButtonColor: '#2b6f54',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        // Desvincular los autos o tecnicos asociados (?)
        // Eliminar
        for (const employeeDelete of employeesToDelete) {
          const index: number = this.employees.indexOf(this.searchEmployeeById(employeeDelete.id));
          if (index !== -1) {
              this.employees.splice(index, 1);
          }
          (await this.employeeService.removeEmployee(employeeDelete.id)).subscribe(result => {
             this.init(this.employees);
          }, error => {
            console.error(error);
            this.errorService();
          });
        }
        this.init(this.employees); // COSA DESECHABLE
        this.selection.selected.length = 0;
        Swal.fire({
          icon: 'success',
          title: 'Eliminado!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  searchEmployeeById(id: number): any {
    for (let user of this.employees) {
      if (user.id === id) {
        return user;
      }
    }
  }

  errorService() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ha ocurrido un problema en el servidor!',
      showConfirmButton: true,
      confirmButtonColor: '#34c4b7',
    })
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if ( !this.spinner ) {
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
  checkboxLabel(row?: Employee): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
