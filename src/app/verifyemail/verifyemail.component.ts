import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css'],
})
export class VerifyemailComponent implements OnInit {
  @Input() email;
  @Input() mode;
  @Output() verifiedSignUp = new EventEmitter<boolean>();
  @Output() verifiedSignIn = new EventEmitter<boolean>();
  formVerifyEmail;
  clicked = false;
  verified;
  constructor(private fb: FormBuilder, private service: AppService) {
    this.formVerifyEmail = this.fb.group({
      email: this.email,
      code: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}
  async onSubmitVerifyEmail() {
    this.clicked = true;
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.email,
        code: this.formVerifyEmail.get('code').value,
      },
    };
    var response = this.service.sendRequest('checkverifycode', data);
    if (
      (await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      this.verified = true;
      if (this.mode === 'signUp') {
        this.verifiedSignUp.emit(true);
      } else if (this.mode === 'signIn') {
        this.verifiedSignIn.emit(true);
      }
    } else {
      this.verified = false;
      if (this.mode === 'signUp') {
        this.verifiedSignUp.emit(false);
      } else if (this.mode === 'signIn') {
        this.verifiedSignIn.emit(false);
      }
    }
  }
  async onSubmitResendCode() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.email,
      },
    };
    this.service.sendRequest('sendverifycode', data);
  }
}
