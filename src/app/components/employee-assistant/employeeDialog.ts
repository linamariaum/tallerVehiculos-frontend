import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewEmployeeRequests } from 'src/app/models/dataRequests/newEmployee';
import { UpdateEmployeeRequests } from 'src/app/models/dataRequests/updateEmployee';
import { Role } from 'src/app/models/role';
import { RoleService } from 'src/app/services/role.service';
//import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'employee-dialog',
  templateUrl: 'employeeDialog.html',
})
export class EmployeeDialog implements OnInit {
  title: string;
  editField: boolean;
  passwordWrote: boolean = false;
  groupControl: FormGroup;
  roles: Role[];

  constructor(
    public dialogRef: MatDialogRef<EmployeeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService) {}

  ngOnInit() {
    this.roleService.getAll().subscribe(data => {
      const datos = data;
      this.roles = datos;
    });
    if (this.data.type === 'create') {
      this.title = 'Nueva vinculación';
      this.editField = false;
      this.groupControl = new FormGroup({
        nameInput: new FormControl('',
          [Validators.required, Validators.minLength(5)]),
        cellphoneInput: new FormControl('',
          [Validators.required, Validators.minLength(7), Validators.maxLength(10)]),
        emailInput: new FormControl('',
         [Validators.required, Validators.email]),
        roleInput: new FormControl('', Validators.required),
        passwordInput: new FormControl('', [Validators.required, Validators.minLength(4)])
      });

    } else if (this.data.type === 'update') {
      this.title = 'Actualización de datos'
      this.editField = true;
      this.groupControl = new FormGroup({
        nameInput: new FormControl({ value: this.data.employee.name, disabled: true }),
        cellphoneInput: new FormControl(
          this.data.employee.cellphone ? this.data.employee.cellphone : '',
          [Validators.required, Validators.minLength(7), Validators.maxLength(10)]),
        emailInput: new FormControl({ value: this.data.employee.email, disabled: true }, Validators.required),
        roleInput: new FormControl(
          { value: this.data.employee.role.id ? this.data.employee.role.id : '', disabled: false },
          Validators.required),
        passwordInput: new FormControl('', [Validators.minLength(4)]),
        newPasswordInput: new FormControl({ value: '', disabled: true }, [Validators.minLength(4)])
      });
      //this.onChanges();
    }
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

  saveEmployee() {
    if (this.data.type === 'create') {
      const newEmployee: NewEmployeeRequests =
        {
          name: this.groupControl.get('nameInput').value,
          password: this.groupControl.get('passwordInput').value,
          //password: bcrypt.hashSync(this.groupControl.get('passwordInput').value, 10),
          email: this.groupControl.get('emailInput').value,
          cellphone: this.groupControl.get('cellphoneInput').value,
          roleId: this.groupControl.get('roleInput').value
        }
        console.log('tipo de cell')
        console.log(typeof(this.groupControl.get('cellphoneInput').value))
        console.log('tipo de rol id')
        console.log(typeof(this.groupControl.get('roleInput').value))
      this.data.employee = newEmployee;

    } else if (this.data.type === 'update') {
      const updateInfo: UpdateEmployeeRequests =
      {
        cellphone: this.groupControl.get('cellphoneInput').value,
        //password: bcrypt.hashSync(this.groupControl.get('passwordInput').value, 10),
        //newPassword: this.groupControl.get('newPasswordInput').value,
        roleId: +this.groupControl.get('roleInput').value
      }
      this.data.employee = updateInfo;
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
