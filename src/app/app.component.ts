import { Component } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../model/user';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DrawEX';
  status = 'ONLINE';
  isConnected = true;
  public user : User;


  constructor(public connectionService: ConnectionService, public cookieService: CookieService, public userService:UserService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
      }
      else {
        this.status = "OFFLINE";
      }

    })

  }
  ngOnInit() {

  }
}
