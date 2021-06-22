import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  postID: any;
  constructor(private http: HttpClient) {}

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
  async uploadPics(data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/addmorepictures',
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
