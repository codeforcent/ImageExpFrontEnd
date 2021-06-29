import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(private http: HttpClient) {}

  getImages() {
    return this.http
      .get('https://image-exp-backend.herokuapp.com/getpicturesbyuserid')
      .toPromise()
      .then((res) => res);
    // .then((data) => {
    //   console.log("data", data);
    //   return data;
    // });
  }

}
