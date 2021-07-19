import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  demoUrl;
  constructor(private http: HttpClient) {
    this.http
      .get('assets/config.json', { responseType: 'json' })
      .subscribe((data) => {
        this.demoUrl = data[1].demoUrl;
      });
  }

  async sendRequest(action, data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(this.demoUrl + action, data, httpOptions);

    await res.toPromise().then((response) => {
      respo = response;
    });

    return respo;
  }
}
