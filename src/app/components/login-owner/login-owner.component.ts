import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OwnerService } from 'src/app/services/owner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-owner',
  templateUrl: './login-owner.component.html',
  styleUrls: ['./login-owner.component.scss'],
})
export class LoginOwnerComponent implements OnInit {
  loginOwnerForm = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ])
  });

  constructor(private ownerService: OwnerService, private router: Router) {}

  ngOnInit(): void {}

  sendToken() {
    console.log(this.loginOwnerForm.get('emailFormControl').value);
    const login = {
      email: this.loginOwnerForm.get('emailFormControl').value,
      password: 'password'
    };
    this.ownerService.loginOwner(login);
    Swal.fire({
      icon: 'info',
      title: 'Se envió enlace de acceso a su correo',
      showConfirmButton: true,
      confirmButtonColor: '#34c4b7',
    }).then(async (result) => {
      this.router.navigate(['/homepage']);
    })
  }

}
