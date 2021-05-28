import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SignupService } from './signup.service';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { HostListener, Directive }  from '@angular/core';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [SignupService]
})

export class SigninComponent implements OnInit {
  formSignUp : FormGroup;
  formSignIn : FormGroup;
  signMode = true;
  user : SocialUser;
  isSignedIn = false;

  constructor(private fb : FormBuilder, private signUpService : SignupService, private authService : SocialAuthService) {
    this.formSignUp = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9_-]*')]],
      repassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9_-]*')]]

    });
    this.formSignIn = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.authService.authState.subscribe((user) => {
      this.user = user;
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
  onSubmitSignIn() {

  }
  onSubmitSignUp() {
    console.log("form", this.formSignUp);
    this.signUpService.saveData(this.formSignUp.value)
    .subscribe();


  }
  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
  onClickSignUpByGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((user) => this.addUserGoogleAccount(user));
    this.isSignedIn = true;
    // console.log(this.user);
  }

  onClickSignOutByGoogle() {
    this.authService.signOut();
    this.isSignedIn = false;
  }
  addUserGoogleAccount(user) {
    if (user) {
      var form = this.fb.group({
        email : user?.email,
        username : user?.name,
        password : user?.password
      });
      this.signUpService.saveData(form.value).subscribe();
    }

  }
}
