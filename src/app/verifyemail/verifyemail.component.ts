import { MessageService } from 'primeng/api';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';

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
  displayPosition: boolean = false;
  position;
  verified_key;
  check_browser_key;
  constructor(
    private fb: FormBuilder,
    private service: AppService,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.http
      .get('assets/config.json', { responseType: 'json' })
      .subscribe((data) => {
        this.verified_key = data[0].verifiedkey;
        this.check_browser_key = data[3].checkbrowserkey;
      });
    this.formVerifyEmail = this.fb.group({
      email: this.email,
      code: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}
  async onSubmitVerifyEmail() {
    if (
      sessionStorage.getItem('242dshY2H2YDU3BU3FDEF') !==
        this.check_browser_key ||
      sessionStorage.getItem('242dshY2H2YDU3BU3FDEF') == null
    ) {
      this.position = 'top';
      this.displayPosition = true;
    }
    this.clicked = true;
    var data = {
      'secret-key': this.verified_key,
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
      'secret-key': this.verified_key,
      body: {
        email: this.email,
      },
    };
    var response = this.service.sendRequest('sendverifycode', data);
    if (
      (await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: await response.then(
          (__zone_symbol__value) => __zone_symbol__value.body.response.message
        ),
      });
    } else {
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: await response.then(
          (__zone_symbol__value) => __zone_symbol__value.body.response.message
        ),
      });
    }
  }
  onClickDialog() {
    this.displayPosition = false;
    location.reload();
  }
}
