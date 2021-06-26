import { HttpClient } from '@angular/common/http';
declare var require: any;
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewChecked,
  AfterContentChecked,
  DoCheck
} from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { ConnService } from '../home/conn.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, AfterViewChecked, AfterContentChecked, DoCheck {
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
    private vigenereCipherService: VigenereCipherService,
    private http: HttpClient,
    private connService: ConnService
  ) {
    if (this.app.cookieService.check('auth-token')) {
      this.getInforUser();
      // this.user.emit();
    } else {
      // window.alert("here is else");
      this.logIn = false;
      this.router.navigate(['']);
    }
  }
  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
  
  }
  ngAfterViewChecked(): void {
    
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    
    
  }
  ngOnInit(): void {
      if (this.email !== undefined) {
      console.log("pass");
      this.connService.connect(this.email);
     this.delay(500);
    }
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  signOut() {
    console.log('email', this.email);
    var dat = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.email,
        status: 'offline',
      },
    };
    this.connService.changeStatus(dat);
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

      this.avatar = res.then(
        (__zone_symbol__value) =>
          (this.avatar = __zone_symbol__value.body.response.avatar)
      );
      this.email = res.then(
        (__zone_symbol__value) =>
          (this.email = __zone_symbol__value.body.response.email)
      );
      if (
        await this.avatar.then(
          (__zone_symbol__value) => __zone_symbol__value === ''
        )
      ) {
        this.avatar =
          'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
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
  async onSearch() {
    var res = this.http.get('https://api.datamuse.com/words?rel_trg=li');
    // https://api.datamuse.com/words?rel_trg=cat
    // https://api.datamuse.com/sug?s=cat
    await res.toPromise().then((response) => {
      console.log('response', response);
    });
  }
}
