import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('f') loginForm: NgForm;
  public errorMessage: string;

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    const emailInput = this.loginForm.value.userData.email;
    const passwordInput = this.loginForm.value.userData.password;
    this.authService.register(emailInput, passwordInput)
      .then(res => {
        this.authService.login(emailInput, passwordInput);
        this.router.navigate(['/user']);
      }, err => {
        this.errorMessage = err.message;
      });
  }

}
