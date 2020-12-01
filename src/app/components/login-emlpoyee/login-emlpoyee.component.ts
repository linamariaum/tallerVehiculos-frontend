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
import * as forge from 'node-forge';

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

    const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAnmFkKq7CnYarrvP06e72WNqjR6VdeW0sJ+fLMMCD8JMfRQg3
8TkbArPw9dgAIXzLoiMlxmT3g166uD2hX1GxycOYHlsaRQkZA4FbVcmgPhDW/2KN
MR5SRewJevyF4glCXY6ijC1y4/iTIAe7v6p8sQn1Oxw6hzGGOaWKIgSMbdb6fuaa
2Ak5C8ifn8phHWAL9kXUhUihgn2yURp/wV7U34VZXk8U1O25K7wWsfRgf9nSYkhm
424UrJzwqthGiS3DErkdro+kaW06ik23h6w9j0M1+ZJr6MI7GiUWJ4efsOLWz+gv
cI46lYhHgU8Gb92P/QLRfKvR1tYtzjjg2nJORwIDAQABAoIBAAUsj1YpoWf+B0vO
4nhl+xxKAD2N9HDMFT40f1nXYDgSxlm9+/3gbLZ45G1ToiV16z0fwtMpZ0CebqEo
OkZf59v8jNKpDUGmG3AW4MH7tUVxzWRIdu5c3Dk2jdS7vS/2N3nQ+BR2Q6OY8k2A
kyyeyDYMajuFH5BdGNJ3SvzzgxbvetTcNJcbqsPRe9xpMDvxPNGECVhUZ0LLdAGu
0bzuJTErDbzVndUSFQoMaFz64aVlGU7JPtIHMZlNObBgwa7wJJan4XjfWIiZkXN4
r5cZ6yH3I09aXIH6JQgmQ85Oib2LBLITcel/NE0OwxTLfKgnL6TtFBedRZ+82ojg
GxKGMlECgYEAzSUtZKQ2oegStcYUfYvLzv24NxuaLITbQpw4efwdfec0pIZn8Fnn
6au81gRzrblUtbVmBCnwjCKL02wqploTOR8lH9Mjdd/l5QjQP58A8xLqVi2/vW1Z
cjwMC+GbNGMl3M0xmHieH9mH0C6ab1KZ71SPMv9mWXwuc7EgC+6r3v8CgYEAxaRz
VC1VxjExOpKuCiya9nQ0ynJwsCeEr+ZJR+w/xUu+9iRiss5+NGbVeTAp711UH62n
uULBX9OBCHyuky/2IGUdH5r+9y7DO43oty/fRqxhzx4BzxWTtZTipBd9NpA/hNII
BL2xeUh9R+gZsVffVROADV4juQpdzMyMs5rp2LkCgYBi5jhzG4PHHGXgwkTgncO8
366uypzSN56pBz1m+beSGiPT6YQ0aHOYwJXCK9VE/GMtUu2CtmFkfcchPzV0i1pX
IH+6TwT6b92aRFx5P4OqrATTVSzp+syzeOVp2PMFF4OKZlYxpny86BdEsyL65jyW
GBMNR/mkzGxslAjaF88+KwKBgQCNJH2/9Yg1u1eerrVfSq93pVE16jgTdIVLYLeg
h1SbPxamjSF29AQow+9bVkv8RrgWz1rh8IxMNK0HNJMvRacNR2he8791Io4F77fr
amKXA+/ti05bZttPZ33bFXM0DhtubNeRGy6soFnnihcfENPK29wsr7fvIzoNUV6B
vPWW8QKBgQCB+55vnoGT2k3Z59KcazHnrmgTf6sdS4Kc5rcksnpd4hVdKV/rtDxA
AdtzotIiGy2kG+HMbvkdq955iUVbL9dd6x0W47MxV2xayEDL7oPrP+CKluHlsMYL
4J6r9Y5+kno2OF1TvsaWFVHmZnID0pbByQjNQ5sAd/NVueZwnJDisg==
-----END RSA PRIVATE KEY-----`

    const publicKeyPem = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw5EOL99DihbxmvnK4k9R
    6NRCHrQjB8diNtxnGV0I2BrnbBen5+2c2LsjXZlpvUlu0sBl8l7CynwRN6ACwzoP
    5+nQ8SXbBqtc23nMHbXWQjU3vKXnQqkJbERfYLe84L714qr0C5M+kaFMJJ/RG1aG
    wo7XgVLVNHOKqYlcLE0NOnykkgSTGPNS02MS5lWkdJpFFe887V+uMqJcqnjgK58q
    DL2K3FdeAnOQ9IOL66kEll/lkpFhSGpOC/fP8xwG+U81qo8/ukck27AggQ6hHrER
    YbLRfBinRLC8B5qA7ZunemwUEye2o57LNj0bj9L1oxubvMB/iVOTt9VqwlnpzucV
    3wIDAQAB
    -----END PUBLIC KEY-----`

    const pub = forge.pki.publicKeyFromPem(publicKeyPem);
    let encrypted = pub.encrypt(this.loginEmployeeForm.get('passwordFormControl').value);

    console.log(this.loginEmployeeForm.get('passwordFormControl').value);

  var publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  console.log(publicKey);

  encrypted = publicKey.encrypt(forge.util.encodeUtf8(this.loginEmployeeForm.get('passwordFormControl').value));
  console.log("Encryption: ");
  console.log(encrypted);

  var privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  var decrypted = forge.util.decodeUtf8(privateKey.decrypt(encrypted));

  console.log("Decryption: ");
  console.log(decrypted);

  //return decrypted;

    console.log(forge.util.encode64(encrypted))
    const login = {
      email: this.loginEmployeeForm.get('emailFormControl').value,
      password: forge.util.encode64(encrypted)
    };

    const encryptedPass = forge.util.decode64(forge.util.encode64(encrypted))
    const priv = forge.pki.privateKeyFromPem(privateKeyPem);

    const decryptedPass = priv.decrypt(encryptedPass);
    console.log(decryptedPass)

    console.log(login)

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
