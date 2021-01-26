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
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';
//import * as bcrypt from 'bcryptjs';

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
  user: Employee;
  error: boolean;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private apiService: AuthService,
    private employeeService: EmployeeService
  ) {
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
    if (login) {
      // login
      await this.apiService.getUser(login).then(
        async (data) => {
          if (data) {
            console.log('Adquirido!');
            // Empleado
            await this.getEmployee(login.email);
            const token = JSON.parse(data);
            sessionStorage.setItem('cod', token.access_token);
            Swal.fire({
              icon: 'success',
              text: 'Ingresando...',
              showConfirmButton: true,
              confirmButtonColor: '#34c4b7',
            }).then((result) => {
              if (result.isConfirmed) {
                sessionStorage.setItem('email', this.user.email);
                sessionStorage.setItem('name', this.user.name);

                switch (this.user.role.name) {
                  case 'management-assistant':
                    this.router.navigate(['employee-assistant']);
                    break;
                  case 'supervisor':
                    this.router.navigate(['employee-supervisor']);
                    break;
                  case 'mechanic':
                    this.router.navigate(['emlpoyee-technical']);
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
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'Ha ocurrido un problema, intentelo más tarde.',
        showConfirmButton: true,
        confirmButtonColor: '#34c4b7',
      });
    }
  }

  async getEmployee(email) {
    await this.employeeService.getEmployee(email).then(async (user: any) => {
      if (user) {
        const aux = JSON.parse(user);
        this.user = aux;
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
      this.router.navigate(['/homepage']);
    });
  }
}
