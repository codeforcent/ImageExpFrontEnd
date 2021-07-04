import { Router } from '@angular/router';
import { VigenereCipherService } from './../vigenere-cipher.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../app.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  username;
  avatar;
  loading;
  id: number;
  sub: any;
  otherUser;
  user;
  constructor(
    private vigenereCipherService: VigenereCipherService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private service: AppService
  ) {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params['id'];
    });
    if (this.cookieService.check('auth-token')) {
      this.getInforUsers();
    } else {
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {}

  async getInforUsers() {
    this.user = await this.getUserByEmail();
    if (this.user.id === this.id) {
      this.router.navigate(['']);
    }
    this.otherUser = await this.getUserById(this.id);
    this.username = this.otherUser.name;
    this.avatar = this.otherUser.avatar;
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
  async getUserById(id: number) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: id,
      },
    };
    var response = this.service.sendRequest('getuserbyid', data);
    this.setLoading(response);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      this.router.navigate(['']);
    }
  }
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
}
