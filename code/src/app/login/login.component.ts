import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('f', { static: false }) loginForm: NgForm;
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
    this.authService.login(emailInput, passwordInput)
      .then(res => {
        this.router.navigate(['/user']);
      }, err => {
        this.errorMessage = err.message;
      });
  }

}
