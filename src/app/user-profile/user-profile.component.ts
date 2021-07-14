import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { AppComponent } from '../app.component';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../app.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [MessageService],
})
export class UserProfileComponent implements OnInit {
  hovered = false;

  formUserProfile: FormGroup;
  items: MenuItem[];
  email;
  username;
  avatar;
  clicked = false;
  user;
  loading;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private app: AppComponent,
    private router: Router,
    private service: AppService,
    private vigenereCipherService: VigenereCipherService,
    private cookieService: CookieService
  ) {
    this.formUserProfile = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      avatar: '',
    });
    if (this.cookieService.check('auth-token')) {
      this.getInforUser();
    } else {
      this.router.navigate(['']);
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  ngOnInit() {
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
  async getInforUser() {
    this.user = await this.getUserByEmail();
    this.email = this.user.email;
    this.avatar = this.user.avatar;
    this.username = this.user.name;
    if (this.avatar === '') {
      this.avatar =
        'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
    }
  }
  async getUserByEmail() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          '24DJBWID328FNSU32Z',
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
  onSelectedFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.avatar = event.target.result;
      };
    }
  }

  async onSubmitUpdateUser() {
    this.clicked = true;
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
    }

    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.email,
        username: this.formUserProfile.get('username').value,
        avatar: this.avatar,
      },
    };

    if (this.formUserProfile.get('username').value !== '' && this.formUserProfile.get('username').valid) {
      var response = this.service.sendRequest('updateuser', data);
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
          detail: 'Updated your profile successfully',
        });
        location.reload();
      } else {
        this.messageService.add({
          key: 'smsg',
          severity: 'error',
          summary: 'Message',
          detail: 'Updated your profile unsuccessfully',
        });
      }
    } else {
    }
  }
}
