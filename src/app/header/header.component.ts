import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() key = new EventEmitter<string>();
  @Output() cat = new EventEmitter<number>();
  clicked = false;
  logIn = false;
  avatar;
  email;
  username;
  loading;
  user;
  cateList = [];
  formSearch: FormGroup;
  prevSearch = '';
  auth_token_key;
  verified_key;
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private vigenereCipherService: VigenereCipherService,
    // private http: HttpClient,
    private service: AppService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.http
      .get('assets/config.json', { responseType: 'json' })
      .subscribe((data) => {
        this.verified_key = data[0].verifiedkey;
        this.auth_token_key = data[2].authtokenkey;
      });

    this.formSearch = this.fb.group({
      content: [''],
    });
  }
  async ngOnInit() {
    await this.delay(1000);
    if (this.cookieService.check('auth-token')) {
      this.getInforUser();
    } else {
      this.logIn = false;
    }
    this.cateList = await this.getAllCategories();
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  signOut() {
    var data = {
      'secret-key': this.verified_key,
      body: {
        email: this.email,
        status: 'offline',
      },
    };
    this.service.sendRequest('changestatus', data);
    this.logIn = false;
    this.cookieService.delete('auth-token');
    location.reload();
  }

  async getInforUser() {
    this.user = await this.getUserByEmail();
    this.avatar = this.user.avatar;
    this.email = this.user.email;
    if (this.avatar === '') {
      this.avatar =
        'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
    }
  }
  async getUserByEmail() {
    var data = {
      'secret-key': this.verified_key,
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          this.auth_token_key,
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
      this.logIn = true;
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      this.cookieService.delete('auth-token');
      this.router.navigate(['']);
    }
  }
  onSearchByTyping() {
    if (this.formSearch.get('content').value.length <= 50) {
      sessionStorage.setItem('key', this.formSearch.get('content').value);
      this.key.emit(this.formSearch.get('content').value);
      this.router.navigate(['/search']);
    } else {
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: 'Please just search for maximum 50 chars',
      });
    }
  }
  onSearchByCategory(id) {
    sessionStorage.setItem('cat', id);
    this.cat.emit(id);
    this.router.navigate(['/search']);
  }
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  async getAllCategories() {
    var response = this.service.sendRequest('getallcategories', '');
    this.setLoading(response);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body
    );
  }
}
