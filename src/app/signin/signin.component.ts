import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../app.service';
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
  clicked;
  existed;
  email;
  loading;
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
  async onSubmitSignIn() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.formSignIn.get('email').value,
        password: this.formSignIn.get('password').value,
      },
    };
    if (this.formSignIn.valid) {
      var response = this.service.sendRequest('loginuser', data);
      this.setLoading(response);
      if (
        await response.then(
          (__zone_symbol__value) =>
            __zone_symbol__value.body.response.status !== 'online'
        )
      ) {
        if (
          (await response.then(
            (__zone_symbol__value) => __zone_symbol__value.body.success
          )) === true
        ) {
          this.email = this.formSignIn.get('email').value;
          var dat = {
            'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
            body: {
              email: this.formSignIn.get('email').value,
              status: 'online',
            },
          };
          var res = this.service.sendRequest('changestatus', dat);
          this.setLoading(res);
          // 24DJBWID328FNSU32Z
          this.cookieService.set(
            'auth-token',
            this.vigenereCipherService.vigenereCipher(
              this.formSignIn.get('email').value,
              '24DJBWID328FNSU32Z',
              true
            )
          );
          this.router.navigate(['']);
        } else {
          this.signInSuccess = false;
        }
      } else {
        this.router.navigate(['']);
      }
    } else {
    }
  }
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  async onSubmitSignUp() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.formSignUp.get('email').value,
        password: this.formSignUp.get('password').value,
      },
    };
    if (this.formSignUp.valid) {
      var response = this.service.sendRequest('registeruser', data);
      this.setLoading(response);
      if (
        (await response.then(
          (__zone_symbol__value) => __zone_symbol__value.body.success
        )) === true
      ) {
        this.email = this.formSignUp.get('email').value;
        var dat = {
          'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
          body: {
            email: this.formSignUp.get('email').value,
            status: 'online',
          },
        };
        var res = this.service.sendRequest('changestatus', dat);
        this.setLoading(res);
        this.service.sendRequest('loginuser', data);
        this.cookieService.set(
          'auth-token',
          this.vigenereCipherService.vigenereCipher(
            this.formSignUp.get('email').value,
            '24DJBWID328FNSU32Z',
            true
          )
        );
        this.router.navigate(['']);
      } else {
        this.existed = true;
        this.signUpSuccess = false;
      }
    } else {
    }
  }
}
