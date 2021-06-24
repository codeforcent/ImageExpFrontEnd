import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { HeaderComponent } from '../header/header.component';
import { VigenereCipherService } from '../vigenere-cipher.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [MessageService, ChangePasswordService],
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
  @ViewChild(HeaderComponent) header: HeaderComponent;
  faEnvelope = faEnvelope;
  faUnlock = faUnlock;
  faLock = faLock;
  items: MenuItem[];
  email;
  formChangePass: FormGroup;
  isCorrect = true;
  avatar;
  username;
  onload = false;
  clicked = false;
  constructor(
    private app: AppComponent,
    private fb: FormBuilder,
    private changePasswordService: ChangePasswordService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    private vigenereCipherService: VigenereCipherService
  ) {
    this.onload = true;
    if (this.app.cookieService.check('auth-token')) {
      this.getInforUser();

      // this.user.emit();
    } else {
      // window.alert("here is else");
      this.onload = false;
      this.router.navigate(['']);
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
  async ngAfterViewInit() {
    // await this.delay(800);
    //  window.alert("email1: " + this.header?.email);
    // this.email =  this.header?.email;
    // this.username =  this.header?.username;
    // this.avatar =  this.header?.avatar;
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // async getuser() {
  //   var data = {
  //     'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
  //     body: {
  //       email: sessionStorage.getItem(this.app.cookieService.get('auth-token'))
  //     }
  //   };
  //   var res = this.userService.getInforUser(data);
  //   this.email = await res.then((__zone_symbol__value) =>  __zone_symbol__value.body.response.email);
  //   this.username = await res.then((__zone_symbol__value) =>  __zone_symbol__value.body.response.name);
  //   this.avatar = await res.then((__zone_symbol__value) =>  __zone_symbol__value.body.response.avatar);
  //   console.warn("here is username1 in user profile", this.username);
  //   if (
  //     res.then((__zone_symbol__value) =>  __zone_symbol__value.body.success === true)
  //   ) {
  //     // setTimeout(() => { }, 500);

  // } else {
  //   this.app.cookieService.delete('auth-token');
  //   this.router.navigate(['']);
  // }
  // console.warn("here is username in userprofile", this.username);
  // }
  async getInforUser() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.app.cookieService.get('auth-token'),
          '24DJBWID328FNSU32Z',
          false
        ),
      },
    };
    var res = this.userService.getInforUser(data);

    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      // setTimeout(() => { }, 500);
      this.email = res.then(
        (__zone_symbol__value) =>
          (this.email = __zone_symbol__value.body.response.email)
      );


      // if (
      //   await this.avatar.then(
      //     (__zone_symbol__value) => __zone_symbol__value === ''
      //   )
      // ) {
      //   this.avatar =
      //     'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
      // }
      this.onload = false;
      // setTimeout(() => { }, 500);
      // this.app.userService.addUser(user);
      // sessionStorage.setItem(this.app.cookieService.get('auth-token'), user.getEmail());
      // this.router.navigate(['']);
    } else {
      // setTimeout(() => { }, 500);
      // this.onload = false;
      // this.signUpSuccess = false;

      this.app.cookieService.delete('auth-token');
      this.router.navigate(['']);
      this.onload = false;
    }
  }
  async onSubmitChangePass() {
    this.onload = true;
    this.clicked = true;
    // if (sessionStorage.getItem(this.app.cookieService.get('auth-token')) !== undefined) {
    //   this.router.navigate(['']);
    // }
    if (
      this.email !==
      this.vigenereCipherService.vigenereCipher(
        this.app.cookieService.get('auth-token'),
        '24DJBWID328FNSU32Z',
        false
      )
    ) {
      this.app.cookieService.delete('auth-token');
      this.router.navigate(['']);
      this.onload = false;
    }
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
      this.onload = false;
      location.reload();
    } else {
      // setTimeout(() => {}, 500);
      this.onload = false;
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