import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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
  selector: 'app-login-owner',
  templateUrl: './login-owner.component.html',
  styleUrls: ['./login-owner.component.scss'],
})
export class LoginOwnerComponent implements OnInit {
  waitingToken: boolean = false;

  loginOwnerForm = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    tokenFormControl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  matcher = new MyErrorStateMatcher();

  constructor() {}

  ngOnInit(): void {}

  sendToken(form: FormGroup) {
    console.log(form);
    this.waitingToken = true;
  }

  login(form: FormGroup) {
    console.log(form);
  }
}
