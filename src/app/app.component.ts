import { Component } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
import { CookieService } from 'ngx-cookie-service';
import firebase from 'firebase/app';
// import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DrawEX';
  status = 'ONLINE';
  isConnected = true;

  constructor(
    public connectionService: ConnectionService,
    public cookieService: CookieService
  ) {
    const firebaseConfig = {};
    firebase.initializeApp(firebaseConfig);
  }
  ngOnInit() {}
}
