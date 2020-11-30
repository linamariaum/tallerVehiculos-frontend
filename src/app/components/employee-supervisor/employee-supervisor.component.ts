import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NewOwnerRequests } from 'src/app/models/dataRequests/newOwner';
import { UpdateEmployeeRequests } from 'src/app/models/dataRequests/updateEmployee';
import { UpdateOwnerRequests } from 'src/app/models/dataRequests/updateOwner';
import { Employee } from 'src/app/models/employee';
import { Owner } from 'src/app/models/Owner';
import { EmployeeService } from 'src/app/services/employee.service';
import { OwnerService } from 'src/app/services/owner.service';
import Swal from 'sweetalert2';
import { ProfileDialog } from '../profile/profileDialog';
import { OwnerDialog } from './ownerDialog';

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
  userEmployee: Employee = {
    id: 45,
    name: 'Pepita Perez',
    password: 'string;',
    email: 'pepita@email.com',
    cellphone: '123123213',
    registryDate: 'string;',
    removalDate: 'string;',
    role: {
      id: 3,
      name: 'Supervisor'
    }
  };
  owners: Owner[];
  dataSource: MatTableDataSource<Owner>;
  columnsToDisplay: string[] = ['select', 'name', 'email', 'cellphone'];
  expandedElement: Owner | null;
  selection: any = new SelectionModel<Owner>(true, []);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  spinner: boolean = true;

  constructor(private employeeService: EmployeeService, public dialogSource: MatDialog,
    private router: Router, private ownerService: OwnerService) { }

  async ngOnInit() {
    /*
    const email = sessionStorage.getItem('email');
    if ( email ) {
      (await this.employeeService.getEmployee(email)).subscribe((user: Employee) => {
        if (user.role.name === 'Supervisor') {
          this.userEmployee = user;
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
      }, error => {
        console.error(error)
        this.errorService();
        this.router.navigate(['/homepage']);
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
    }*/

    await this.loadOwners();
    this.init(this.owners);
  }

  init(datos: Owner[]) {
    this.dataSource = new MatTableDataSource(datos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Items por página';
  }

  profile() {
    this.openProfileDialog(this.userEmployee);
  }

  openProfileDialog(employee: Employee) {
    const id = employee.id;
    const dialogRef = this.dialogSource.open(ProfileDialog, {
      data: { employee: employee}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner = true;
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
        this.errorService();
        this.spinner = false;
      }
    );
  }

  async loadOwners() {
    return this.ownerService.getAllOwners().then(
      (data) => {
        if (data && data.length > 0) {
          this.owners = data;
          this.spinner = false;
        } else {
          Swal.fire({
            icon: 'warning',
            text: 'No se encontraron propietarios',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          });
          this.spinner = false;
        }
      }, (error) => {
        console.error(error);
        this.spinner = false;
        this.errorService();
      }
    );
  }

  add() {
    let ow: NewOwnerRequests = {
      name: '',
      email: '',
      cellphone: ''
    };
    this.openDialog(ow, 'create');
  }

  update(owner) {
    this.openDialog(owner, 'update');
  }

  openDialog(owner: any, type: string) {
    const dialogRef = this.dialogSource.open(OwnerDialog, {
      data: { owner: owner, type: type}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'create') {
          this.spinner = true;
          this.createOwner(result.owner);
        } else if ( result.type === 'update') {
          const id = owner.id;
          this.spinner = true;
          this.updateOwner(id, result.owner);
        }
      }
    });
  }

  async createOwner(newOwner: NewOwnerRequests) {
    return this.ownerService.createOwner(newOwner).then(
      async (data) => {
        if (data && data.length > 0) { // COSA
          Swal.fire({
            icon: 'success',
            title: `Propietario agregado exitosamente.`,
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7'
          });
          await this.loadOwners();
          this.init(this.owners);
        }
      }, (error) => {
        console.error(error);
        this.errorService();
        this.spinner = false;
      }
    );
  }

  async updateOwner(id: number, updateOwner: UpdateOwnerRequests) {
    return this.ownerService.updateOwner(id, updateOwner). then(
      async (data) => {
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Información del propietario actualizada correctamente.',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7'
          });
          await this.loadOwners();
          this.init(this.owners);
        }
      }, (error) => {
        console.error(error);
        this.errorService();
        this.spinner = false;
      }
    );
  }

  remove(owner) {
    Swal.fire({
      title: `¿Eliminar propietario ${owner.name}?`,
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
        (await this.ownerService.removeOwner(owner.id)).subscribe(result => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado!',
            showConfirmButton: false,
            timer: 1500
          });
          const index: number = this.owners.indexOf(this.searchOwnerById(owner.id));
          if (index !== -1) {
              this.owners.splice(index, 1);
          }
          this.init(this.owners);
        }, (error) => {
          console.error(error);
          this.errorService();
        });
      }
    });
  }

  getSelectedOwners(): any[] {
    return [...this.selection.selected];
  }

  deleteSelectedOwners() {
    const ownersToDelete = this.getSelectedOwners();
    Swal.fire({
      title: '¿Eliminar propietarios seleccionados?',
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
        for (const ownerDelete of ownersToDelete) {
          const index: number = this.owners.indexOf(this.searchOwnerById(ownerDelete.id));
          if (index !== -1) {
              this.owners.splice(index, 1);
          }
          (await this.ownerService.removeOwner(ownerDelete.id)).subscribe(result => {
             this.init(this.owners);
          }, error => {
            console.error(error);
            this.errorService();
          });
        }
        this.init(this.owners); // COSA DESECHABLE
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

  searchOwnerById(id: number): any {
    for (let owner of this.owners) {
      if (owner.id === id) {
        return owner;
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
  checkboxLabel(row?: Owner): string {
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
