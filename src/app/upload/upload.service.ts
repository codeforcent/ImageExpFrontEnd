import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class UploadService {
  postID: any;
  constructor(private http: HttpClient) {}

  async uploadPost(data) {
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    var respo = null;
    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/addpost',
      data,
      httpOptions
    );
    setTimeout(() => {}, 500);
    await res.toPromise().then((response) => {
      respo = response;
    });
    return respo;
  }
  async getAllCategories() {
    var respo = null;
    const httpOptions: { headers; observe } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      "body": {
        "name": "Life"
      },
    };
    var res1 =  await this.http.post(
      'https://image-exp-backend.herokuapp.com/addcategory',
      data,
      httpOptions
    );
    res1.toPromise().then((response) => {
      respo = response;
    });


    var res = await this.http.post(
      'https://image-exp-backend.herokuapp.com/getallcategories',

      httpOptions
    );
    setTimeout(() => {}, 500);
    await res.toPromise().then((response) => {
      respo = response;
    });
    return respo;
  }
}
