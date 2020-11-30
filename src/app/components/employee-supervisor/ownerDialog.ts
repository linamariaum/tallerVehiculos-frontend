import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewOwnerRequests } from 'src/app/models/dataRequests/newOwner';
import { UpdateOwnerRequests } from 'src/app/models/dataRequests/updateOwner';

@Component({
  selector: 'owner-dialog',
  templateUrl: 'ownerDialog.html',
})
export class OwnerDialog implements OnInit {
  title: string;
  editField: boolean;
  groupControl: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<OwnerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data.type === 'create') {
      this.title = 'Nuevo propietario';
      this.editField = false;
      this.groupControl = new FormGroup({
        nameInput: new FormControl('',
          [Validators.required, Validators.minLength(5)]),
        cellphoneInput: new FormControl('',
          [Validators.required, Validators.minLength(7), Validators.maxLength(10)]),
        emailInput: new FormControl('',
         [Validators.required, Validators.email])
      });

    } else if (this.data.type === 'update') {
      this.title = 'Actualización de datos'
      this.editField = true;
      this.groupControl = new FormGroup({
        nameInput: new FormControl({ value: this.data.owner.name, disabled: true }),
        cellphoneInput: new FormControl(
          this.data.owner.cellphone ? this.data.owner.cellphone : '',
          [Validators.required, Validators.minLength(7), Validators.maxLength(10)]),
        emailInput: new FormControl(this.data.owner.email ? this.data.owner.email : '',
          [Validators.required, Validators.email])
      });
    }
  }

  saveOwner() {
    if (this.data.type === 'create') {
      const newOwner: NewOwnerRequests =
        {
          name: this.groupControl.get('nameInput').value,
          email: this.groupControl.get('emailInput').value,
          cellphone: this.groupControl.get('cellphoneInput').value
        }
      this.data.owner = newOwner;

    } else if (this.data.type === 'update') {
      const updateInfo: UpdateOwnerRequests =
      {
        email: this.groupControl.get('emailInput').value,
        cellphone: this.groupControl.get('cellphoneInput').value
      }
      this.data.owner = updateInfo;
    }
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

  onNoClick(): void {
    this.dialogRef.close();
  }

}
