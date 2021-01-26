import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { NewOwnerRequests } from "src/app/models/dataRequests/newOwner";
import { UpdateOwnerRequests } from "src/app/models/dataRequests/updateOwner";
import { Owner } from "src/app/models/Owner";
import { OwnerService } from "src/app/services/owner.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'owner-info-dialog',
  templateUrl: 'ownerInfo.html',
})
export class OwnerInfoDialog implements OnInit {
  title: string;
  groupControl: FormGroup;
  editField: boolean;
  owner: Owner;

  @Input() idOwner: number;
  @Input() operationType: string;
  @Output() changes  = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<OwnerInfoDialog>, private ownerService: OwnerService) {}

    async ngOnInit() {
      this.title = 'Información del propietario';
      if (this.operationType == 'create') {
        this.editField = false;
      } else {
        this.editField = true;
      }
      if (this.idOwner != -1) {
        await this.loadOwner();

      } else {
        const ow: Owner = {
          id: -1,
          name: ' ',
          email: ' ',
          cellphone: ' '
        }
        this.owner = ow;
      }
      this.groupControl = new FormGroup({
        nameInput: new FormControl({ value: this.owner.name ? this.owner.name : '', disabled: this.editField },
        [Validators.required]),
        cellphoneInput: new FormControl(
          { value: this.owner.cellphone ? this.owner.cellphone : '', disabled: false},
          [Validators.required]),
        emailInput: new FormControl({ value: this.owner.email ? this.owner.email : '', disabled: false },
          [Validators.required, Validators.email])
      });


    }

    async loadOwner() {
      return this.ownerService.getOwner(this.idOwner).then(
        (result) => {
          const data = JSON.parse(result);
          if (data) {
            this.owner = data;
          }
        }, (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un problema en el servidor!',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          })
        }
      );

    }

    save() {
      if (this.operationType == 'create') {
        const owner: NewOwnerRequests = {
          name: this.groupControl.get('nameInput').value,
          email: this.groupControl.get('emailInput').value,
          cellphone: this.groupControl.get('cellphoneInput').value
        };
        this.createOwner(owner);
      } else {
        const owner: UpdateOwnerRequests = {
          email: this.groupControl.get('emailInput').value,
          cellphone: this.groupControl.get('cellphoneInput').value
        };
        this.updateOwner(owner);
      }
    }

    createOwner(owner: NewOwnerRequests) {
      return this.ownerService.createOwner(owner).then(
        async (data) => {
          if (data) {
            Swal.fire({
              icon: 'success',
              title: `Propietario agregado exitosamente.`,
              showConfirmButton: true,
              confirmButtonColor: '#34c4b7'
            });
            this.changes.emit(true);
          } else {
            this.changes.emit(false);
          }
        }, (error) => {
          this.changes.emit(false);
          console.error(error);
          this.errorService();
        }
      );
    }

    updateOwner(owner: UpdateOwnerRequests) {
      return this.ownerService.updateOwner(this.idOwner, owner).then(
        async (data) => {
          if (data) {
            Swal.fire({
              icon: 'success',
              title: 'Información del propietario actualizada correctamente.',
              showConfirmButton: true,
              confirmButtonColor: '#34c4b7'
            });
            this.changes.emit(true);
          } else {
            this.changes.emit(false);
          }
        }, (error) => {
          this.changes.emit(false);
          console.error(error);
          this.errorService();
        }
      );

    }

    public getError(controlName: string): string {
      let error = '';
      const control = this.groupControl.get(controlName);
      if (control.touched && control.errors != null) {
        error = JSON.stringify(control.errors);
        if (control.errors.required) {
          return 'Campo requerido. ';
        }
        if (control.errors.email) {
          return 'Ingrese un correo válido. '
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

    backward() {
      this.changes.emit(false);
    }

}
