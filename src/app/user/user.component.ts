import { Router } from '@angular/router';
import { AppComponent } from './../app.component';
import { VigenereCipherService } from './../vigenere-cipher.service';
import { UserService } from './user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  userId;
  username;
  avatar;
  onload = false;
  id: number;
  sub: any;
  constructor(
    private userService: UserService,
    private vigenereCipherService: VigenereCipherService,
    private app: AppComponent,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
    });
    if (this.app.cookieService.check('auth-token')) {
      this.checkCookie();
      this.getInforUser();
      // this.user.emit();
    } else {
      // window.alert("here is else");
      this.onload = false;
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {

  }
  async checkCookie() {
    // console.log("here is id", this.id);
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
      // this.userId = res.then(
      //   (__zone_symbol__value) =>
      //     (this.userId = __zone_symbol__value.body.response.id)
      // );

      // this.avatar = res.then(
      //   (__zone_symbol__value) =>
      //     (this.avatar = __zone_symbol__value.body.response.avatar)
      // );
      // this.username = res.then(
      //   (__zone_symbol__value) =>
      //     (this.username = __zone_symbol__value.body.response.name)
      // );

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
  async getInforUser() {
    // console.log("here is id", this.id);
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: this.id
      },
    };
    var res = this.userService.getInforUserById(data);

    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      // setTimeout(() => { }, 500);
      // this.userId = res.then(
      //   (__zone_symbol__value) =>
      //     (this.userId = __zone_symbol__value.body.response.id)
      // );

      this.avatar = res.then(
        (__zone_symbol__value) =>
          (this.avatar = __zone_symbol__value.body.response.avatar)
      );
      this.username = res.then(
        (__zone_symbol__value) =>
          (this.username = __zone_symbol__value.body.response.name)
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

      // this.app.cookieService.delete('auth-token');
      // this.router.navigate(['']);
      this.onload = false;
    }
  }
}
