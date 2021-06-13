import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { VigenereCipherService } from '../vigenere-cipher.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output('getUser') user = new EventEmitter<any>();
  clicked = false;
  logIn;
  avatar;
  email;
  username;
  constructor(
    private app: AppComponent,
    private router: Router,
    private userService: UserService,
    private vigenereCipherService: VigenereCipherService
  ) {


    if (this.app.cookieService.check('auth-token')) {

      this.getInforUser();
      // this.user.emit();
    } else {
      // window.alert("here is else");
      this.logIn = false;
    }

  }

  ngOnInit(): void {}
  signOut() {
    this.logIn = false;
    this.app.cookieService.delete('auth-token');
  }

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
      this.avatar = res.then(
        (__zone_symbol__value) =>
          (this.avatar = __zone_symbol__value.body.response.avatar)
      );
      this.username = res.then(
        (__zone_symbol__value) =>
          (this.username = __zone_symbol__value.body.response.name)
      );

      if (await this.avatar.then((__zone_symbol__value) => __zone_symbol__value === '')) {
        this.avatar = "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";
      }
      this.logIn = true;
      // setTimeout(() => { }, 500);
      // this.app.userService.addUser(user);
      // sessionStorage.setItem(this.app.cookieService.get('auth-token'), user.getEmail());
      // this.router.navigate(['']);
    } else {
      // setTimeout(() => { }, 500);
      // this.onload = false;
      // this.signUpSuccess = false;

      this.logIn = false;
      this.app.cookieService.delete('auth-token');
      this.router.navigate(['']);
    }
    // var user = this.app.userService.getUserByToken(this.app.cookieService.get('token'));
    // window.alert("here is if");


  }

}
