import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { OwnerService } from 'src/app/services/owner.service';

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

  constructor(private ownerService: OwnerService) {}

  ngOnInit(): void {}

  sendToken() {
    console.log(this.loginOwnerForm.get('emailFormControl').value);
    const login = {
      email: this.loginOwnerForm.get('emailFormControl').value,
      //password: bcrypt.hashSync(this.loginEmployeeForm.get('passwordFormControl').value, 10)
      password: 'password'
    };
    //this.ownerService.loginOwner(login);
  }

}
