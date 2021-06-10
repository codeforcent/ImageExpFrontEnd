import { Component, OnInit } from '@angular/core';
import {
  faEnvelope,
  faLock,
  faUnlock,
} from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from 'primeng/api';
import { AppComponent } from '../app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangePasswordService } from './change-password.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [MessageService, ChangePasswordService],
})
export class ChangePasswordComponent implements OnInit {
  faEnvelope = faEnvelope;
  faUnlock = faUnlock;
  faLock = faLock;
  items: MenuItem[];
  email: string;
  formChangePass: FormGroup;
  isCorrect = true;
  avatar;
  username;
  constructor(
    private app: AppComponent,
    private fb: FormBuilder,
    private changePasswordService: ChangePasswordService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {
    if (sessionStorage.getItem(this.app.cookieService.get('auth-token')) !== undefined) {
      console.warn('user-profile#ok');
      this.getuser();
    }

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
  }

  ngOnInit(): void {
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
  async getuser() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: sessionStorage.getItem(this.app.cookieService.get('auth-token'))
      }
    };
    var res = this.userService.getInforUser(data);
    this.email = await res.then((__zone_symbol__value) =>  __zone_symbol__value.body.response.email);
    this.username = await res.then((__zone_symbol__value) =>  __zone_symbol__value.body.response.name);
    this.avatar = await res.then((__zone_symbol__value) =>  __zone_symbol__value.body.response.avatar);
    console.warn("here is username1 in user profile", this.username);
    if (
      res.then((__zone_symbol__value) =>  __zone_symbol__value.body.success === true)
    ) {
      // setTimeout(() => { }, 500);
      var user = new User(
        this.app.cookieService.get('auth-token'),
        this.email,
        this.username,
        this.avatar,
        1
      );

      var a = user.getAvatar();

  } else {
    this.app.cookieService.delete('auth-token');
    this.router.navigate(['']);
  }
  console.warn("here is username in userprofile", this.username);
  }
  async onSubmitChangePass() {
    // if (sessionStorage.getItem(this.app.cookieService.get('auth-token')) !== undefined) {
    //   this.router.navigate(['']);
    // }
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.email,
        password: this.formChangePass.get('password').value,
        newpassword: this.formChangePass.get('newpassword').value,
      },
    };
    var res = this.changePasswordService.changePass(data);
    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      // setTimeout(() => {}, 500);
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Changed password successfully',
      });
      this.isCorrect = true;
    } else {
      // setTimeout(() => {}, 500);
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
