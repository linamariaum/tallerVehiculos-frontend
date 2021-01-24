import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Owner } from 'src/app/models/Owner';
import { OwnerService } from 'src/app/services/owner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'owner--dialog',
  templateUrl: 'owner-dialog.html',
})
export class OwnerDialog implements OnInit {
  title: string;
  owners: Owner[] = [];
  groupControl: FormGroup;
  dataSource: MatTableDataSource<Owner>;
  columnsToDisplay: string[] = ['name', 'email', 'cellphone', 'edit'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  spinner: boolean = true;
  isResulstEmpty = true;
  id: number;
  edit: boolean = false;
  operationType: string;

  constructor(
    public dialogRef: MatDialogRef<OwnerDialog>, private ownerService: OwnerService) {}

    async ngOnInit() {
      this.title = 'Gestionar propietarios';
      await this.loadOwners();
    }

    init(datos: Owner[]) {
      if (!this.isResulstEmpty) {
        this.spinner = false;
        this.dataSource = new MatTableDataSource(datos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }

    async loadOwners() {
      return this.ownerService.getAllOwners().then(
        (result) => {
          const data = JSON.parse(result);
          if (data && data.length > 0) {
            this.isResulstEmpty = false;
            data.forEach(element => {
              let owner: Owner = {
                id: element.id,
                name: element.name,
                email: element.email,
                cellphone: element.cellphone
              }
              this.owners.push(owner);
            });
            this.spinner = false;
            this.init(this.owners);
          }
        }, (error) => {
          console.error(error);
          this.spinner = false;
          this.isResulstEmpty = false;
          this.errorService();
        }
      );
    }

    addOwner() {
      this.edit = true;
      this.operationType = 'create';
      this.id = -1;
    }

    updateOwner(id) {
      this.edit = true;
      this.operationType = 'update';
      this.id = id;
    }

    async receiveReply(changes) {
      if (changes) {
        this.isResulstEmpty = true;
        this.spinner = true;
        this.owners = [];
        await this.loadOwners();
        this.init(this.owners);
      }
      this.edit = false;
    }

    public getError(controlName: string): string {
      let error = '';
      const control = this.groupControl.get(controlName);
      if (control.touched && control.errors != null) {
        error = JSON.stringify(control.errors);
        if (control.errors.required) {
          return 'Campo requerido. ';
        }
        return 'No cumple con la logitud indicada. '
      } else {
        return error;
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

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
