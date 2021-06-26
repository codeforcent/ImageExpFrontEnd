import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionService } from 'ngx-connection-service';

@Injectable({
  providedIn: 'root',
})
export class ConnService {
  hasNetworkConnection: boolean;
  hasInternetAccess: boolean;
  status: string;
  constructor(
    private connectionService: ConnectionService,
    private http: HttpClient
  ) {}
  connect(email) {
    this.connectionService.monitor().subscribe((currentState) => {
      this.hasNetworkConnection = currentState.hasNetworkConnection;
      this.hasInternetAccess = currentState.hasInternetAccess;
      if (this.hasNetworkConnection && this.hasInternetAccess) {
        var data = {
          'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
          body: {
            email: email,
            status: 'online',
          },
        };
        this.changeStatus(data);
        this.status = 'ONLINE';
      } else {
        var data = {
          'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
          body: {
            email: email,
            status: 'offline',
          },
        };
        this.changeStatus(data);
        this.status = 'OFFLINE';
      }
    });
  }
  async changeStatus(data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/changestatus',
      data,
      httpOptions
    );
    setTimeout(() => {}, 500);
    await res.toPromise().then((response) => {
      respo = response;
    });
    return respo;
  }
  async getStatus(data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/getstatus',
      data,
      httpOptions
    );
    setTimeout(() => {}, 500);
    await res.toPromise().then((response) => {
      respo = response;
    });
    return respo;
  }
}
