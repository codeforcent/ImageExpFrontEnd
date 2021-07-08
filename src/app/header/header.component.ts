import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../app.service';
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
  loading;
  user;
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private vigenereCipherService: VigenereCipherService,
    private http: HttpClient,
    private service: AppService
  ) {
    if (this.cookieService.check('auth-token')) {
      this.getInforUser();
    } else {
      this.logIn = false;

    }
  }
  ngOnInit(): void {

  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  signOut() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.email,
        status: 'offline',
      },
    };
    this.service.sendRequest('changestatus', data);
    this.logIn = false;
    this.cookieService.delete('auth-token');
  }

  async getInforUser() {
    this.user = await this.getUserByEmail();
    this.avatar = this.user.avatar;
    this.email = this.user.email;
    if (this.avatar === '') {
      this.avatar =
        'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
    }
    this.logIn = true;
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
  async onSearch() {
    var res = this.http.get('https://api.datamuse.com/words?rel_trg=li');
    // https://api.datamuse.com/words?rel_trg=cat
    // https://api.datamuse.com/sug?s=cat
    await res.toPromise().then();
  }
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
}
