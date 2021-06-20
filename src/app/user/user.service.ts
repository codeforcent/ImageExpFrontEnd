import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  postID: any;
  constructor(private http: HttpClient) {}

  async getInforUser(data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/getuserbyemail',
      data,
      httpOptions
    );
    setTimeout(() => {}, 500);
    await res.toPromise().then((response) => {
      respo = response;
    });
    return respo;
  }
  async getInforUserById(data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/getuserbyid',
      data,
      httpOptions
    );
    setTimeout(() => {}, 500);
    await res.toPromise().then((response) => {
      respo = response;
    });
    return respo;
  }
  async getPic() {
    // this.http
    //   .post<any>('http://localhost:4200/user', {
    //     success: 'false',
    //   })
    //   .subscribe((data) => {
    //     this.postID = data;
    //   });

    // return this.http.post<any>(
    //   'https://image-exp-backend.herokuapp.com/registeruser',
    //   this.data
    // );
  }
  async uploadPic(data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/addpicture',
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
