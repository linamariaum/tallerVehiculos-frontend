import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Employee } from 'src/app/models/employee';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Role } from 'src/app/models/role';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialog } from './employeeDialog';
import { NewEmployeeRequests } from 'src/app/models/dataRequests/newEmployee';
import { UpdateEmployeeRequests } from 'src/app/models/dataRequests/updateEmployee';
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
  userEmployee: Employee;
  name = sessionStorage.getItem('name');
  employees: Employee[] = [];
  dataSource: MatTableDataSource<Employee>;
  columnsToDisplay: string[] = ['select', 'name', 'email', 'cellphone', 'role'];
  expandedElement: Employee | null;
  selection: any = new SelectionModel<Employee>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  spinner: boolean = true;
  control: FormGroup;
  roles: Role[];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    public employeeDialog: MatDialog,
    private router: Router,
    private roleService: RoleService
  ) {}

  async ngOnInit() {
    this.roleService.getAll().subscribe((data) => {
      data = JSON.parse(data);
      const datos = data;
      this.roles = datos;
    });
    this.control = this.formBuilder.group({
      controlRole: [''],
    });
    const email = sessionStorage.getItem('email');
    if (email) {
      await this.employeeService.getEmployee(email).then((user: any) => {
        user = JSON.parse(user);
        if (user.role.name === 'management-assistant') {
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
      });
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

    await this.loadEmployees();
    this.init(this.employees);
    this.onChanges();
  }

  init(datos: Employee[]) {
    this.dataSource = new MatTableDataSource(datos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Items por página';
  }

  onChanges() {
    this.control.get('controlRole').valueChanges.subscribe((selectedRole) => {
      selectedRole = JSON.parse(selectedRole);
      if (selectedRole != '0') {
        let employeeFilter = this.searchEmployeeByRole(selectedRole);
        if (employeeFilter.length > 0) {
          this.init(employeeFilter);
        } else {
          Swal.fire({
            title: `No se encontraron empleados para el cargo ${this.searchNameByRole(
              selectedRole
            )}`,
            confirmButtonColor: '#34c4b7',
          });
        }
      } else {
        // Renderiza todos los empleados
        this.init(this.employees);
      }
    });
  }

  searchEmployeeByRole(idRole: number): Employee[] {
    let employeesFilter: Employee[] = [];
    this.employees.forEach((element) => {
      if (element.role.id === idRole) {
        employeesFilter.push(element);
      }
    });
    return employeesFilter;
  }

  searchNameByRole(idRole: string): string {
    const id = +idRole;
    let name = '';
    this.roles.forEach((element) => {
      if (element.id === id) {
        name = element.name;
      }
    });
    return name;
  }

  async loadEmployees() {
    return this.employeeService.getAllEmployees().then(
      (data) => {
        data = JSON.parse(data);
        if (data && data.length > 0) {
          data.forEach((element) => {
            let employee: Employee = {
              id: element.id,
              name: element.name,
              password: element.password,
              email: element.email,
              cellphone: element.cellphone,
              registryDate: element.registryDate,
              removalDate: element.removalDate,
              role: {
                id: element.roleId,
                name: this.searchNameByRole(element.roleId),
              },
            };
            this.employees.push(employee);
          });
          this.spinner = false;
        }
      },
      (error) => {
        console.error(error);
        this.spinner = false;
        this.errorService();
      }
    );
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
        this.spinner = true;
        this.updateEmployee(id, result.employee);
      }
    });
  }

  add() {
    let empl: NewEmployeeRequests = {
      password: '',
      name: '',
      email: '',
      cellphone: '',
      roleId: 0,
    };
    this.openDialog(empl, 'create');
  }

  update(employee) {
    this.openDialog(employee, 'update');
  }

  openDialog(employee: any, type: string) {
    const dialogRef = this.employeeDialog.open(EmployeeDialog, {
      data: { employee: employee, type: type },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.type === 'create') {
          this.spinner = true;
          this.createEmployee(result.employee);
        } else if (result.type === 'update') {
          this.spinner = true;
          const id = employee.id;
          this.updateEmployee(id, result.employee);
        }
      }
    });
  }

  async createEmployee(newEmployee: NewEmployeeRequests) {
    return this.employeeService.createEmployee(newEmployee).then(
      async (data) => {
        if (data) {
          data = JSON.parse(data);
          Swal.fire({
            icon: 'success',
            title: `Empleado agregado exitosamente.`,
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          });
          this.employees = [];
          await this.loadEmployees();
          this.init(this.employees);
        }
      },
      (error) => {
        console.error(error);
        this.errorService();
        this.spinner = false;
      }
    );
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
          this.employees = [];
          await this.loadEmployees();
          this.init(this.employees);
        }
      },
      (error) => {
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
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.value) {
        // Desvincular los autos o tecnicos asociados (?)
        // Eliminar
        (await this.employeeService.removeEmployee(employee.id)).subscribe(
          (result) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado!',
              showConfirmButton: false,
              timer: 1500,
            });
            const index: number = this.employees.indexOf(
              this.searchEmployeeById(employee.id)
            );
            if (index !== -1) {
              this.employees.splice(index, 1);
            }
            this.init(this.employees);
          },
          (error) => {
            console.error(error);
            this.errorService();
          }
        );
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
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.value) {
        // Desvincular los autos o tecnicos asociados (?)
        // Eliminar
        for (const employeeDelete of employeesToDelete) {
          const index: number = this.employees.indexOf(
            this.searchEmployeeById(employeeDelete.id)
          );
          if (index !== -1) {
            this.employees.splice(index, 1);
          }
          (
            await this.employeeService.removeEmployee(employeeDelete.id)
          ).subscribe(
            (result) => {
              this.init(this.employees);
            },
            (error) => {
              console.error(error);
              this.errorService();
            }
          );
        }
        this.selection.selected.length = 0;
        Swal.fire({
          icon: 'success',
          title: 'Eliminado!',
          showConfirmButton: false,
          timer: 1500,
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
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (!this.spinner) {
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
