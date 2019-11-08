import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  selectedVal: string;
  responseMessage = '';
  responseMessageType = '';
  emailInput: string;
  passwordInput: string;
  isForgotPassword: boolean;
  userDetails: any;

  constructor(private authService: AuthService) {
    this.selectedVal = 'login';
    this.isForgotPassword = false;
  }

  ngOnInit() {
  }

  // Comman Method to Show Message and Hide after 6 seconds
  showMessage(type, msg) {
    this.responseMessageType = type;
    this.responseMessage = msg;
    setTimeout(() => {
      this.responseMessage = '';
    }, 6000);
  }

  // Called on switching Login/ Register tabs
  public onValChange(val: string) {
    this.showMessage('', '');
    this.selectedVal = val;
  }

  // Check localStorage is having User Data
  isUserLoggedIn() {
    this.userDetails = this.authService.isUserLoggedIn();
  }

  // SignOut Firebase Session and Clean LocalStorage
  logoutUser() {
    this.authService.logout()
      .then(res => {
        console.log(res);
        this.userDetails = undefined;
        localStorage.removeItem('user');
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Login user with  provided Email/ Password
  loginUser() {
    this.responseMessage = '';
    this.authService.login(this.emailInput, this.passwordInput)
      .then(res => {
        console.log(res);
        this.showMessage('success', 'Successfully Logged In!');
        this.isUserLoggedIn();
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Register user with  provided Email/ Password
  registerUser() {
    this.authService.register(this.emailInput, this.passwordInput)
      .then(res => {
        // Send Varification link in email
        this.authService.sendEmailVerification().then(res => {
          console.log(res);
          this.isForgotPassword = false;
          this.showMessage('success', 'Registration Successful! Please Verify Your Email');
        }, err => {
          this.showMessage('danger', err.message);
        });
        this.isUserLoggedIn();
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Send link on given email to reset password
  forgotPassword() {
    this.authService.sendPasswordResetEmail(this.emailInput)
      .then(res => {
        console.log(res);
        this.isForgotPassword = false;
        this.showMessage('success', 'Please Check Your Email');
      }, err => {
        this.showMessage('danger', err.message);
      });
  }
}
