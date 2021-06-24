import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  postID: any;
  data: any;
  errorMessage: any;
  httpRequest: HttpRequest<any>;
  method: string;

  constructor(private http: HttpClient) {}

  getList() {
    // const request = new HttpRequest(
    //   "POST", "http://localhost:8000/registeruser", {},
    //    {reportProgress: true});

    this.http
      .post<any>('https://image-exp-backend.herokuapp.com/registeruser', {
        success: 'false',
      })
      .subscribe((data) => {
        this.postID = data;
      });

    return this.http.post<any>(
      'https://image-exp-backend.herokuapp.com/registeruser',
      this.data
    );
  }
  async signUp(data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/registeruser',
      data,
      httpOptions
    );
    setTimeout(() => {}, 500);
    await res.toPromise().then((response) => {
      respo = response;
    });
    return respo;
  }
  async signIn(data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/loginuser',
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