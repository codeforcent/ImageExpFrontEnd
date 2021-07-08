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
  @Output() verifiedSignUp = new EventEmitter<boolean>();
  @Output() verifiedSignIn = new EventEmitter<boolean>();
  formVerifyEmail;

  constructor(private fb: FormBuilder, private service: AppService) {
    this.formVerifyEmail = this.fb.group({
      email: this.email,
      code: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}
  async onSubmitVerifyEmail() {
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
      console.log('verify sc');
      this.verifiedSignUp.emit(true);
      this.verifiedSignIn.emit(true);
    } else {
      console.log('verify unsc');
      this.verifiedSignUp.emit(false);
      this.verifiedSignIn.emit(false);
    }
  }
  async onSubmitResendCode() {
    console.log('email in verify', this.email);
    console.log('resend', this.email);
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.email,
      },
    };
    this.service.sendRequest('sendverifycode', data);
  }
}
