import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { UserService } from '../user/user.service';
import { VigenereCipherService } from '../vigenere-cipher.service';
// import { ConnectionService } from 'ng-connection-service';
import { ConnectionService } from 'ngx-connection-service';
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

  clicked;
  existed;
  // isConnected = true;
  // status = 'OFFLINE';
  hasNetworkConnection: boolean;
  hasInternetAccess: boolean;
  status: string;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private app: AppComponent,
    // public userService: UserService,
    private vigenereCipherService: VigenereCipherService,
    private connectionService: ConnectionService
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
      repassword: [''],
    });
    this.formSignIn = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    if (this.app.cookieService.check('auth-token')) {
      // if (
      //   this.app.cookieService.get('token') === this.userService.getUserByEmail().
      // ) {
      // this.app.cookieService.delete('token');
      this.router.navigate(['']);
      // }
    }
  }

  ngOnInit(): void {}
  onClickSignIn() {
    this.clicked = true;
  }
  onClickSignUp() {
    this.clicked = true;
  }
  onClickTransformSignIn() {
    this.clicked = false;
    this.signMode = false;
  }
  onClickTransformSignUp() {
    this.clicked = false;
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
    if (this.formSignIn.valid) {
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
        this.app.cookieService.set(
          'auth-token',
          this.vigenereCipherService.vigenereCipher(
            this.formSignIn.get('email').value,
            '24DJBWID328FNSU32Z',
            true
          )
        );
        // this.connectionService.monitor().subscribe((isConnected) => {
        //   this.isConnected = isConnected;
        //   if (this.isConnected) {
        //     console.log('Online');
        //     this.status = 'ONLINE';
        //     this.app.cookieService.set('status', this.status);
        //   } else {
        //     console.log('Offline');
        //     this.status = 'OFFLINE';
        //     this.app.cookieService.set('status', this.status);
        //   }
        // });
        this.connectionService.monitor().subscribe((currentState) => {
          this.hasNetworkConnection = currentState.hasNetworkConnection;
          this.hasInternetAccess = currentState.hasInternetAccess;
          if (this.hasNetworkConnection && this.hasInternetAccess) {
            this.status = 'ONLINE';
          } else {
            this.status = 'OFFLINE';
          }
        });

        this.router.navigate(['']);
      } else {
        // setTimeout(() => { }, 500);
        this.onload = false;
        this.signInSuccess = false;
      }
    } else {
      this.onload = false;
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
    if (this.formSignUp.valid) {
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

        this.app.cookieService.set(
          'auth-token',
          this.vigenereCipherService.vigenereCipher(
            this.formSignUp.get('email').value,
            '24DJBWID328FNSU32Z',
            true
          )
        );
        // this.connectionService.monitor().subscribe((isConnected) => {
        //   console.log("connection");
        //   this.isConnected = isConnected;
        //   if (this.isConnected) {
        //     console.log('Online');
        //     this.status = 'ONLINE';
        //     this.app.cookieService.set('status', this.status);
        //   } else {
        //     console.log('Offline');
        //     this.status = 'OFFLINE';
        //     this.app.cookieService.set('status', this.status);
        //   }
        // });
        // var user = new User(
        //   token,
        //   this.formSignUp.get('email').value,
        //   '',
        //   '',
        //   1
        // );
        // this.app.userService.addUser(user);

        // set online status

        // set online status when disconnecting
        this.connectionService.monitor().subscribe((currentState) => {
          this.hasNetworkConnection = currentState.hasNetworkConnection;
          this.hasInternetAccess = currentState.hasInternetAccess;
          if (this.hasNetworkConnection && this.hasInternetAccess) {
            window.alert("online in signin");

            this.status = 'ONLINE';
          } else {

            window.alert("offline in signin");
            this.status = 'OFFLINE';
          }
        });
        this.router.navigate(['']);
      } else {
        // setTimeout(() => { }, 500);
        this.existed = true;
        this.onload = false;
        this.signUpSuccess = false;
      }
    } else {
      this.onload = false;
    }
  }
}
