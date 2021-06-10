import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserProfileService } from './user-profile.service';
import { MessageService } from 'primeng/api';
import { AppComponent } from '../app.component';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [MessageService],
})
export class UserProfileComponent implements OnInit {
  onload = false;
  hovered = false;
  url: string;
  username: any;
  formUserProfile: FormGroup;
  items: MenuItem[];
  avatar;
  email;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private messageService: MessageService,
    private app: AppComponent,
    private router: Router,
    private userService: UserService
  ) {
    this.formUserProfile = this.fb.group({
      username: ['', Validators.maxLength(50)],
      avatar: '',
    });
    // setTimeout(() => {}, 2000);
    if (sessionStorage.getItem(this.app.cookieService.get('auth-token')) !== undefined) {
      console.warn('user-profile#ok');
      this.getuser();
    }
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


    if (user.getAvatar() !== undefined) {
      this.url = user.getAvatar();
    } else {
      this.url = 'https://data.whicdn.com/images/252447756/original.jpg';
    }
    if (user.getUsername() !== undefined) {
      this.username = user.getUsername();
    }
  } else {
    this.app.cookieService.delete('auth-token');
    this.router.navigate(['']);
  }
  console.warn("here is username in userprofile", this.username);
  }
  onSelectedFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }

  async onSubmitUpdateUser() {
    // if (sessionStorage.getItem(this.app.cookieService.get('auth-token')) !== undefined) {
    //   this.app.cookieService.delete('auth-token');
    //   this.router.navigate(['']);
    // }

    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      'body': {
        'email': this.email,
        'username': this.formUserProfile.get('username').value,
        'avatar': this.url,
      },
    };
    var res = this.userProfileService.updateUser(data);
console.warn('suc', (await res.then(
  (__zone_symbol__value) => __zone_symbol__value.body.success
)) === true);
    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      this.onload = true;


      // this.app.user.setUsername(this.formUserProfile.get('username').value);
      // this.app.user.setAvatar(this.url);
      // setTimeout(() => {}, 500);
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Updated your profile successfully',
      });
      location.reload();
    } else {
      this.onload = false;
      // setTimeout(() => {}, 500);
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: 'Updated your profile unsuccessfully',
      });
    }
  }
}
