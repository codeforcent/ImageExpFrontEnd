import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  async sendRequest(action, data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/' + action,
      data,
      httpOptions
    );

    await res.toPromise().then((response) => {
      respo = response;
    });

    return respo;
  }
}
