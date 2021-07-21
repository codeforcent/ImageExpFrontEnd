import { AppService } from '../app.service';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { config } from '../../config';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [],
})
export class SigninComponent implements OnInit {
  formSignUp: FormGroup;
  formSignIn: FormGroup;
  signMode = true;
  signUpSuccess = true;
  signInSuccess = true;
  clicked: boolean;
  existed: boolean;
  email: any;
  loading: boolean;
  verifiedSignUp = false;
  verifiedSignIn = false;

  /**
   * Creates an instance of SigninComponent.
   * @param {FormBuilder} fb
   * @param {Router} router
   * @param {VigenereCipherService} vigenereCipherService
   * @param {CookieService} cookieService
   * @param {AppService} service
   * @memberof SigninComponent
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vigenereCipherService: VigenereCipherService,
    private cookieService: CookieService,
    private service: AppService
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

    if (this.cookieService.check('auth-token')) {
      this.router.navigate(['']);
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

  /**
   * Determines whether submit sign in on
   * Sign in when user submit formSignIn
   * Catch if account is online or unverified
   * @return {*}  {Promise<void>}
   * @memberof SigninComponent
   */
  async onSubmitSignIn(): Promise<void> {
    var data = {
      'secret-key': config.verified_key,
      body: {
        email: this.formSignIn.get('email').value,
        password: this.formSignIn.get('password').value,
      },
    };
    if (this.formSignIn.valid) {
      var response = this.service.sendRequest('loginuser', data);
      this.setLoading(response);
      // if (
      //   await response.then(
      //     (__zone_symbol__value) =>
      //       __zone_symbol__value.body.response.status !== 'online'
      //   )
      // ) {
      if (
        (await response.then(
          (__zone_symbol__value) => __zone_symbol__value.body.success
        )) === true
      ) {
        this.email = this.formSignIn.get('email').value;
        var dt = {
          'secret-key': config.verified_key,
          body: {
            email: this.formSignIn.get('email').value,
          },
        };
        var res = this.service.sendRequest('getverifystate', dt);
        this.setLoading(res);
        if (
          (await res.then(
            (__zone_symbol__value) => __zone_symbol__value.body.response.state
          )) === false
        ) {
          var dat = {
            'secret-key': config.verified_key,
            body: {
              email: this.email,
            },
          };
          var response = this.service.sendRequest('sendverifycode', dat);
          this.setLoading(response);
          this.verifiedSignIn = true;
        } else {
          sessionStorage.clear();
          this.verifiedSignIn = false;
          this.onSignIn();
        }
      } else {
        this.signInSuccess = false;
      }
      // } else {
      // this.router.navigate(['']);
      // }
    }
  }

  /**
   * Change loading status
   * @param {Promise<any>} promise
   * @memberof SigninComponent
   */
  setLoading(promise: Promise<any>): void {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  /**
   * Sign up when user submit formSignUp
   * Catch if account is unverified
   * @return {*}  {Promise<void>}
   * @memberof SigninComponent
   */
  async onSubmitSignUp(): Promise<void> {
    var data = {
      'secret-key': config.verified_key,
      body: {
        email: this.formSignUp.get('email').value,
        password: this.formSignUp.get('password').value,
      },
    };
    if (
      this.formSignUp.valid &&
      this.formSignUp.get('password').value ===
        this.formSignUp.get('repassword').value
    ) {
      var response = this.service.sendRequest('registeruser', data);
      this.setLoading(response);
      if (
        (await response.then(
          (__zone_symbol__value) => __zone_symbol__value.body.success
        )) === true
      ) {
        sessionStorage.setItem(
          '242dshY2H2YDU3BU3FDEF',
          config.check_browser_key
        );
        this.email = this.formSignUp.get('email').value;
        var dat = {
          'secret-key': config.verified_key,
          body: {
            email: this.formSignUp.get('email').value,
          },
        };
        var response = this.service.sendRequest('sendverifycode', dat);
        this.setLoading(response);
        this.verifiedSignUp = true;
      } else {
        this.verifiedSignUp = false;
        this.existed = true;
        this.signUpSuccess = false;
      }
    }
  }
  /**
   * Catch event that user have submitted formVerifyEmail
   * If verifying is successful, change verify state and user status, then log in
   * @param {*} ev
   * @memberof SigninComponent
   */
  onVerifySignUp(ev: boolean): void {
    if (ev == true) {
      var dt = {
        'secret-key': config.verified_key,
        body: {
          email: this.email,
          state: true,
        },
      };
      var res = this.service.sendRequest('setverifystate', dt);
      this.setLoading(res);
      var data = {
        'secret-key': config.verified_key,
        body: {
          email: this.email,
          status: 'online',
        },
      };
      var response = this.service.sendRequest('changestatus', data);
      this.setLoading(response);
      var dat = {
        'secret-key': config.verified_key,
        body: {
          email: this.email,
          password: this.formSignIn.get('password').value,
        },
      };
      this.service.sendRequest('loginuser', dat);
      this.cookieService.set(
        'auth-token',
        this.vigenereCipherService.vigenereCipher(
          this.formSignUp.get('email').value,
          config.auth_token_key,
          true
        )
      );
      this.router.navigate(['']);
    }
  }
  /**
   * Catch event that user have submitted formVerifyEmail
   * If verifying is successful, call onSignIn()
   * @param {*} ev
   * @memberof SigninComponent
   */
  onVerifySignIn(ev: boolean): void {
    if (ev == true) {
      this.onSignIn();
    }
  }
  /**
   * Change verify state and user status, then log in
   * @memberof SigninComponent
   */
  onSignIn(): void {
    var dt = {
      'secret-key': config.verified_key,
      body: {
        email: this.email,
        state: true,
      },
    };
    var res = this.service.sendRequest('setverifystate', dt);
    this.setLoading(res);

    var data = {
      'secret-key': config.verified_key,
      body: {
        email: this.email,
        status: 'online',
      },
    };
    var response = this.service.sendRequest('changestatus', data);
    this.setLoading(response);
    var dat = {
      'secret-key': config.verified_key,
      body: {
        email: this.email,
        password: this.formSignIn.get('password').value,
      },
    };
    this.service.sendRequest('loginuser', dat);
    this.cookieService.set(
      'auth-token',
      this.vigenereCipherService.vigenereCipher(
        this.formSignIn.get('email').value,
        config.auth_token_key,
        true
      )
    );
    this.router.navigate(['']);
  }
}
