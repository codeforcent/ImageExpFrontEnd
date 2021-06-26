import { Component } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../model/user';
import { ConnService } from './home/conn.service';
import { UserService } from './user/user.service';
import { VigenereCipherService } from './vigenere-cipher.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DrawEX';
  status = 'ONLINE';
  isConnected = true;
  public user: User;

  constructor(
    public connectionService: ConnectionService,
    public cookieService: CookieService,
    public userService: UserService,
    private connService: ConnService,
    private vigenereCipherService: VigenereCipherService
  ) {
    this.connectionService.monitor().subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        console.log('Online');
        this.status = 'ONLINE';
        var email = this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          '24DJBWID328FNSU32Z',
          false
        );
        var dat = {
          'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
          body: {
            email: email,
            status: 'online',
          },
        };
        this.connService.changeStatus(dat);
        this.cookieService.set('status', this.status);
      } else {
        console.log('Offline');
        this.status = 'OFFLINE';
        var email = this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          '24DJBWID328FNSU32Z',
          false
        );
        var dat = {
          'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
          body: {
            email: email,
            status: 'offline',
          },
        };
        this.connService.changeStatus(dat);
        this.cookieService.set('status', this.status);
      }
    });
  }
  ngOnInit() {}
}
