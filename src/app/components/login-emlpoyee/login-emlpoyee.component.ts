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
import * as CryptoJS from 'crypto-js';

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

  constructor(private router: Router, private apiService: AuthService, private employeeService: EmployeeService) {
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

  ngOnInit(): void { }

  async login() {

    const publicKey = `-----BEGIN RSA PUBLIC KEY-----
    MIIBCgKCAQEAmbUxk0iPtrKMNR8Tkv4K0xFRsNACtZCclQ+1GMcP8t2+I7qCQWrS
    QIuDzvpQXHT7Z2MGLPFbDCD9lD8sfbHbTRxUjai93uN/w+L/qOY86c0gdRFdqO+X
    W1FjtHx+jaCaHXs4nHutzjfcBH0rXydzkuUUoTzdxuB4psJYAOnOh7xWQpzbR9w7
    FDAeBXQ8rNtgFHhe46SifO68G1y3Enbl2QBsITmz58UJE9Bsv7MFn2fnyVTUWwYp
    AYGcTlTXND0rZsr1/RPyTsx9pOdb5okxQx9kIP+8MUXhNBTW+VdT0cVkAPtgpMuR
    OttyvL8JgLvIPXQjWcql25DsoSX3D9Ph5QIDAQAB
    -----END RSA PUBLIC KEY-----`

    // Encrypt
    const encryptedPas = CryptoJS.AES.encrypt(
      this.loginEmployeeForm.get('passwordFormControl').value,
      publicKey).toString();

    const login = {
      email: this.loginEmployeeForm.get('emailFormControl').value,
      password: encryptedPas
    };

    console.log(login)

    const textoDesencriptado = CryptoJS.AES.decrypt(
      login.password, publicKey).toString(CryptoJS.enc.Utf8);
    console.log(textoDesencriptado)

    if ( login ) {
      // Empleado
      (await this.employeeService.getEmployee(login.email)).subscribe(async (user: Employee) => {
        console.log(user)
        if (user) {
          this.user = user;
          //const match = await bcrypt.compare(this.loginEmployeeForm.get('passwordFormControl').value, user.password);
          if (true) {

            sessionStorage.setItem('email', this.user.email);
            // login
            await this.apiService.getUser(login).then(
              async (data) => {
                if (data) {
                  console.log('Adquirido!');
                  Swal.fire({
                    icon: 'success',
                    text: 'Ingresando...',
                    showConfirmButton: true,
                    confirmButtonColor: '#34c4b7',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      switch (this.user.role.name) {
                        case 'Asistente de gerencia':
                          this.router.navigate(['employee-assistant']);
                          break;
                        case 'Supervisor':
                          this.router.navigate(['employee-supervisor']);
                          break;
                        case 'Mecánico':
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
                    text: 'Los datos ingresados son erróneos. 401',
                    showConfirmButton: true,
                    confirmButtonColor: '#34c4b7',
                  });
                } else {
                  Swal.fire({
                    icon: 'warning',
                    text: 'Ha ocurrido un problema, intentelo más tarde. 500',
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
              text: 'Los datos ingresados son erróneos. NO HIZO MATCH',
              showConfirmButton: true,
              confirmButtonColor: '#34c4b7',
            });
          }

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No tiene permiso para acceder a este recurso! Redireccionando NO ENCONTRE EL GETEMPLOYEE',
            showConfirmButton: true,
            confirmButtonColor: '#34c4b7',
          });
          this.router.navigate(['/homepage']);
        }
      }, error => {
        console.error(error)
        this.router.navigate(['/homepage']);0
      });
//////////////////////
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'Ha ocurrido un problema, intentelo más tarde. NO HAY OBJ LOGIN',
        showConfirmButton: true,
        confirmButtonColor: '#34c4b7',
      });
    }
  }

}
