import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';
import Swal from 'sweetalert2';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login-emlpoyee',
  templateUrl: './login-emlpoyee.component.html',
  styleUrls: ['./login-emlpoyee.component.scss'],
})
export class LoginEmlpoyeeComponent implements OnInit {
  loginEmployeeForm: FormGroup;
  user: any;
  error: boolean;
  matcher = new MyErrorStateMatcher();
  roles: Role[];

  constructor(private router: Router, private apiService: AuthService, private roleService: RoleService) {
    this.loginEmployeeForm = new FormGroup({
      emailFormControl: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      passwordFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  ngOnInit(): void {}

  async login() {
    const login = {
      email: this.loginEmployeeForm.get('emailFormControl').value,
      password: this.loginEmployeeForm.get('passwordFormControl').value,
    };

    await this.apiService.getUser(login).then(
      (data) => {
        if (data) {
          console.log('Token adquirido!');
          this.user = data;
          if (this.user) {
            sessionStorage.setItem('id', this.user.id.toString());
          }
          Swal.fire({
            icon: 'success',
            text: 'Ingresando...',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          }).then((result) => {
            if (result.isConfirmed) {
              this.roleService.getAll().subscribe(data => {
                this.roles = data;
              });
              const nameRole = this.searchNameByRole(this.user.role.id);
              switch (nameRole) {
                case 'Asistente de gerencia':
                  this.router.navigate(['employee-assistant', this.user.id]);
                  break;
                case 'Supervisor':
                  this.router.navigate(['employee-supervisor', this.user.id]);
                  break;
                case 'Mecánico':
                  this.router.navigate(['emlpoyee-technical', this.user.id]);
                  break;
                default:
                  this.router.navigate(['/homepage']);
                  break;
              }
            }
          });
        }
      },
      (error) => {
        if (error.status == 401) {
          Swal.fire({
            icon: 'warning',
            text: 'Los datos ingresados son erróneos.',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          });
        } else {
          Swal.fire({
            icon: 'warning',
            text: 'Ha ocurrido un problema, intentelo más tarde.',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          });
        }
        console.error(error);
      }
    );
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

}
