import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { User } from '../../model/user';
import { UserService } from '../user/user.service';
import { VigenereCipherService } from '../vigenere-cipher.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [AuthService, UserService],
})
export class SigninComponent implements OnInit {
  @ViewChild('p') p;

  formSignUp: FormGroup;
  formSignIn: FormGroup;
  signMode = true;

  isSignedIn = false;
  onload = false;
  signUpSuccess = true;
  signInSuccess = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private app: AppComponent,
    // public userService: UserService,
    private vigenereCipherService: VigenereCipherService
  ) {
    this.formSignUp = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z0-9_-]*'),
        ],
      ],
      repassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z0-9_-]*'),
        ],
      ],
    });
    this.formSignIn = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    // if (this.app.cookieService.check('token')) {
    //   if (
    //     this.app.cookieService.get('token') === this.userService.getUserByEmail().
    //   ) {
    //     this.app.cookieService.delete('token');
    //     this.router.navigate(['']);
    //   }
    // }

  }

  ngOnInit(): void { }
  onClick() { }
  onClickSignIn() {
    this.signMode = false;
  }
  onClickSignUp() {
    this.signMode = true;
  }
  async onSubmitSignIn() {
    this.onload = true;
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.formSignIn.get('email').value,
        password: this.formSignIn.get('password').value,
      },
    };
    var res = this.authService.signIn(data);
    // var token = (
    //   Math.floor(Math.random() * (999999 - 100000)) + 100000
    // ).toString();

    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      // 24DJBWID328FNSU32Z
      this.app.cookieService.set('auth-token', this.vigenereCipherService.vigenereCipher(this.formSignIn.get('email').value, '24DJBWID328FNSU32Z', true));
      // window.alert("this is encrypte " + this.app.cookieService.get('auth_token'));
      // window.alert("this is decrypte " + this.vigenereCipherService.vigenereCipher(this.app.cookieService.get('auth_token'), '24DJBWID328FNSU32Z', false));
      // this.app.cookieService.set('auth_token', token);
      // window.alert(this.app.cookieService.get('token'))
      console.warn("token sign in", 123);
      // var user = new User(
      //   token,
      //   this.formSignIn.get('email').value,
      //   '',
      //   '',
      //   1
      // );
      // this.app.userService.addUser(user);
      // window.alert(this.app.userService.getUserByToken(token));
      // sessionStorage.setItem(this.app.cookieService.get('auth-token'), this.formSignIn.get('email').value);
      this.router.navigate(['']);

    } else {
      // setTimeout(() => { }, 500);
      this.onload = false;
      this.signInSuccess = false;
    }
  }
  async onSubmitSignUp() {
    this.onload = true;

    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.formSignUp.get('email').value,
        password: this.formSignUp.get('password').value,
      },
    };
    var res = this.authService.signUp(data);
    // var token = (
    //   Math.floor(Math.random() * (999999 - 100000)) + 100000
    // ).toString();
    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      // setTimeout(() => { }, 500);
      this.authService.signIn(data);

      this.app.cookieService.set('auth-token', this.vigenereCipherService.vigenereCipher(this.formSignUp.get('email').value, '24DJBWID328FNSU32Z', true));
      // var user = new User(
      //   token,
      //   this.formSignUp.get('email').value,
      //   '',
      //   '',
      //   1
      // );
      // this.app.userService.addUser(user);

      this.router.navigate(['']);
    } else {
      // setTimeout(() => { }, 500);
      this.onload = false;
      this.signUpSuccess = false;
    }
  }
}
