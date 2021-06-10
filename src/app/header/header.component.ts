import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  clicked = false;
  logIn;
  avatar;
  email;
  username;
  constructor(private app: AppComponent, private router: Router, private userService:UserService) {
    var img = undefined;


    if (
      this.app.cookieService.check('auth-token') &&
      sessionStorage?.getItem(this.app.cookieService.get('auth-token')) !== undefined

    ) {

      var data = {
        'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
        body: {
          email: sessionStorage.getItem(this.app.cookieService.get('auth-token'))
        }
      };
      var res = this.userService.getInforUser(data);
      this.email = res.then((__zone_symbol__value) => this.email = __zone_symbol__value.body.response.email);
      this.username = res.then((__zone_symbol__value) => this.username = __zone_symbol__value.body.response.name);
      this.avatar = res.then((__zone_symbol__value) => this.avatar =  __zone_symbol__value.body.response.avatar);
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
        // setTimeout(() => { }, 500);
        // this.app.userService.addUser(user);
        // sessionStorage.setItem(this.app.cookieService.get('auth-token'), user.getEmail());
        // this.router.navigate(['']);
      } else {
        // setTimeout(() => { }, 500);
        // this.onload = false;
        // this.signUpSuccess = false;
      }
      // var user = this.app.userService.getUserByToken(this.app.cookieService.get('token'));
      // window.alert("here is if");
      this.logIn = true;

      if (
       user.getAvatar() !== '' &&
        user.getAvatar() !== undefined
      ) {
        img = this.logIn ? user.getAvatar() : null;
      }
    } else {
      // window.alert("here is else");
      this.logIn = false;
    }
    var ds = user;
    console.warn('this.login', this.logIn);
    console.warn('imgds', ds);
    if (img === undefined) {
      this.avatar = 'https://data.whicdn.com/images/252447756/original.jpg';
    } else if (img === null) {
      this.logIn = false;
      sessionStorage.removeItem(this.app.cookieService.get('token'))
      // this.app.userService.removeUserByToken(this.app.cookieService.get('token'));
      this.app.cookieService.delete('token');
      this.router.navigate(['']);
    } else {
      this.avatar = user.getAvatar();
    }
    console.warn('avatar', this.avatar);
  }

  ngOnInit(): void { }
  signOut() {
    this.logIn = false;
    sessionStorage.removeItem(this.app.cookieService.get('token'))
    this.app.cookieService.delete('token');
  }
}
