import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  sub: Subscription;
  edit = true;
  employee = {
    name: 'danielJaramillo',
    email: 'dani@gmail.com',
    cellphone: '3214444444',
    password: '1234',
  };
  profileForm = new FormGroup({
    cellphoneFormControl: new FormControl(
      { value: this.employee.cellphone, disabled: true },
      [Validators.required, Validators.minLength(7), Validators.maxLength(10)]
    ),
    emailFormControl: new FormControl(
      { value: this.employee.email, disabled: true },
      [Validators.required, Validators.email]
    ),
    passwordFormControl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmFormControl: new FormControl('', [Validators.required]),
  });

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        // Recuperar usuario por id
        // this.ownerService.get(id).subscribe((user: any) => {
        //   if (user) {
        //     // User
        //   } else {
        //     Swal.fire({
        //       icon: 'info',
        //       title: `Owner not found`,
        //       text: `Owner with id '${id}' not found, returning to homepage`,
        //       showConfirmButton: false,
        //       timer: 1800
        //     });
        //     this.router.navigate(['/homepage']);
        //   }
        // });
      }
    });
  }

  toggleEdit() {
    this.edit = false;
    this.profileForm.enable();
  }

  save() {
    this.profileForm.disable();
  }
}
