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
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(private router: Router, private apiService: AuthService) {
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
              switch (this.user.role.id) {
                case 1:
                  this.router.navigate(['employee-assistant', this.user.id]);
                  break;
                case 2:
                  this.router.navigate(['employee-assistant', this.user.id]);
                  break;
                case 3:
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
}
