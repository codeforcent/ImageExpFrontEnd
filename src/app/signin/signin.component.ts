import { Component, OnInit } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }  from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SignupService } from './signup.service';
import { SocialUser } from 'angularx-social-login';
import {ViewChild} from '@angular/core'
import { JsonPipe } from '@angular/common';
 import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [SignupService]
})

export class SigninComponent implements OnInit {
  @ViewChild("p") p;
  formSignUp : FormGroup;
  formSignIn : FormGroup;
  signMode = true;
  user : SocialUser;
  isSignedIn = false;
  onload = false;
  signUpSuccess = true;
  signInSuccess = true;
  constructor(private fb : FormBuilder, private signUpService : SignupService, private router: Router) {
    this.formSignUp = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9_-]*')]],
      repassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9_-]*')]]

    });
    this.formSignIn = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  ngOnInit(): void {

  }

  onClickSignIn() {
    this.signMode = false;
  }
  onClickSignUp() {
    this.signMode = true;

  }
  async onSubmitSignIn() {
    this.onload = true;
    var data = {
      "secret-key" : "d7sTPQBxmSv8OmHdgjS5",
      "body" : {
        "email" : this.formSignIn.get('email').value,
        "password" : this.formSignIn.get('password').value
    } };
    var res = this.signUpService.signIn(data);
    if (await res.then(__zone_symbol__value => __zone_symbol__value.body.success) === true) {
      setTimeout( () => {  }, 500 );
      this.router.navigate(['']);
    } else {
      setTimeout( () => {  }, 500 );
      this.onload = false;
      this.signInSuccess = false;
    }
  }
  async onSubmitSignUp() {
    this.onload = true;

    var data = {
      "secret-key" : "d7sTPQBxmSv8OmHdgjS5",
      "body" : {
        "email" : this.formSignUp.get('email').value,
        "password" : this.formSignUp.get('password').value
    } };
    var res = this.signUpService.signUp(data);
    if (await res.then(__zone_symbol__value => __zone_symbol__value.body.success) === true) {
      setTimeout( () => {  }, 500 );
      this.signUpService.signIn(data);
      this.router.navigate(['']);
    } else {
      setTimeout( () => {  }, 500 );
      this.onload = false;
      this.signUpSuccess = false;
    }
    if (!this.signUpSuccess) {
      this.p.open();
    }




  }




}
