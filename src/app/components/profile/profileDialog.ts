import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateEmployeeRequests } from 'src/app/models/dataRequests/updateEmployee';
import { Role } from 'src/app/models/role';
import { RoleService } from 'src/app/services/role.service';
//import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'profile-dialog',
  templateUrl: 'profileDialog.html',
})
export class ProfileDialog implements OnInit {
  title: string;
  editField: boolean;
  passwordWrote: boolean = false;
  groupControl: FormGroup;
  roles: Role[];

  constructor(
    public dialogRef: MatDialogRef<ProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private roleService: RoleService) {}

    ngOnInit() {
      this.roleService.getAll().subscribe(data => {
        const datos = data;
        this.roles = datos;
      });
      this.title = 'Información del perfil';
      this.editField = false;
      this.groupControl = new FormGroup({
        nameInput: new FormControl({ value: this.data.employee.name, disabled: true }),
        cellphoneInput: new FormControl(
          { value: this.data.employee.cellphone ? this.data.employee.cellphone : '', disabled: true},
          [Validators.required, Validators.minLength(7), Validators.maxLength(10)]),
        emailInput: new FormControl({ value: this.data.employee.email, disabled: true }, Validators.required),
        roleInput: new FormControl(
          { value: this.data.employee.role.id ? this.data.employee.role.id : '', disabled: true },
          Validators.required),
        passwordInput: new FormControl('', [Validators.minLength(4)]),
        newPasswordInput: new FormControl({ value: '', disabled: true }, [Validators.minLength(4)])
      });
      //this.onChanges();

    }

    // onChanges() {
    //   this.groupControl.get('passwordInput').valueChanges.subscribe(
    //     passwrote => {
    //       if ( this.groupControl.get('passwordInput').value.length >= 4 ) {
    //         this.passwordWrote = true;
    //         this.groupControl.get('newPasswordInput').enable();
    //       } else {
    //         this.passwordWrote = false;
    //         this.groupControl.get('newPasswordInput').disable();
    //       }
    //     }
    //   );
    // }

    updateEmployee() {
      const updateInfo: UpdateEmployeeRequests =
      {
        cellphone: this.groupControl.get('cellphoneInput').value,
        //password: bcrypt.hashSync(this.groupControl.get('passwordInput').value, 10),
        //newPassword: this.groupControl.get('newPasswordInput').value,
        roleId: this.data.employee.role.id
      }
      this.data.employee = updateInfo;
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

    allowEditInfo() {
      this.title = 'Actualizar información'
      this.editField = true;
      this.groupControl.get('cellphoneInput').enable();
      this.groupControl.get('passwordInput').enable();
    }

    onNoClick(): void {
      this.editField = false;
      this.dialogRef.close();
    }

}
