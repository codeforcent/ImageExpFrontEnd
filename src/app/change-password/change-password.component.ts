import { Component, OnInit } from '@angular/core';
import {
  faEnvelope,
  faLock,
  faUnlock,
} from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { AppService } from '../app.service';
import { CookieService } from 'ngx-cookie-service';
import { config } from '../../config';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [MessageService],
})
export class ChangePasswordComponent implements OnInit {
  faEnvelope = faEnvelope;
  faUnlock = faUnlock;
  faLock = faLock;
  items: MenuItem[];
  email;
  formChangePass: FormGroup;
  isCorrect = true;
  clicked = false;
  loading;
  user;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private vigenereCipherService: VigenereCipherService,
    private service: AppService,
    private cookieService: CookieService
  ) {
    this.formChangePass = this.fb.group({
      email: this.email,
      password: ['', [Validators.required]],
      newpassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z0-9_-]*'),
        ],
      ],
      renewpassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z0-9_-]*'),
        ],
      ],
    });
    this.items = [
      {
        label: 'Edit profile',
        icon: 'pi pi-pw pi-user-edit',
      },
      {
        label: 'Change password',
        icon: 'pi pi-pw pi-lock',
      },
    ];
  }

  async ngOnInit() {
    await this.delay(500);
    if (this.cookieService.check('auth-token')) {
      this.getInforUser();
    } else {
      this.router.navigate(['']);
    }
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getInforUser() {
    this.user = await this.getUserByEmail();
    this.email = this.user.email;
  }
  async getUserByEmail() {
    var data = {
      'secret-key': config.verified_key,
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          config.auth_token_key,
          false
        ),
      },
    };
    var response = this.service.sendRequest('getuserbyemail', data);
    this.setLoading(response);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      this.cookieService.delete('auth-token');
      this.router.navigate(['']);
    }
  }
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  async onSubmitChangePass() {
    this.clicked = true;

    if (
      this.email !==
      this.vigenereCipherService.vigenereCipher(
        this.cookieService.get('auth-token'),
        config.auth_token_key,
        false
      )
    ) {
      this.cookieService.delete('auth-token');
      this.router.navigate(['']);
    }
    if (
      this.formChangePass.valid &&
      this.formChangePass.get('newpassword').value ===
        this.formChangePass.get('renewpassword').value
    ) {
      var data = {
        'secret-key': config.verified_key,
        body: {
          email: this.email,
          password: this.formChangePass.get('password').value,
          newpassword: this.formChangePass.get('newpassword').value,
        },
      };
      var response = this.service.sendRequest('changeuserpassword', data);
      this.setLoading(response);
      if (
        (await response.then(
          (__zone_symbol__value) => __zone_symbol__value.body.success
        )) === true
      ) {
        this.messageService.add({
          key: 'smsg',
          severity: 'success',
          summary: 'Message',
          detail: 'Changed password successfully',
        });
        this.isCorrect = true;

        location.reload();
      } else {
        this.isCorrect = false;
        this.messageService.add({
          key: 'smsg',
          severity: 'error',
          summary: 'Message',
          detail: 'Changed password unsuccessfully',
        });
      }
    }
  }
}
