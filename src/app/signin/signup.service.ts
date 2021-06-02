import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest,HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignupService {
  postID : any;
  data: any;
  errorMessage: any;
  httpRequest : HttpRequest<any>
  method: string;

  constructor(private http: HttpClient) { }

  getList() {
    const request = new HttpRequest(
      "POST", "http://localhost:8000/registeruser", {},
       {reportProgress: true});
    console.warn("request",this.http.request(request).subscribe(event => console.log("ev", event)));
    // return this.http.get('http://localhost:8000/registeruser');
    var data1 = this.http.post<any>('http://localhost:8000/registeruser', { "success": "false" }).subscribe(data => {
    this.postID = data;
    console.warn("postID", data);
    });
    // console.warn("postID", this.postID);
    // var data2 = this.jsonPipe.transform(data1);
    // console.warn("data2", data2);
    return this.http.post<any>('http://localhost:8000/registeruser', this.data);
    // .subscribe( {
    //   next: data => {
    //      this.data = data.total

    //     } ,
    //   error: error => {
    //     this.errorMessage = error.status

    //   }
    // }

    //   )

      return this.errorMessage;

  }
  async signUp(data) {

    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      observe: 'response'
    };

    var respo = null;
    var res = await this.http.post('http://localhost:8000/registeruser', data, httpOptions);
    setTimeout( () => {  }, 500 );
    await res.toPromise().then(response =>{
      console.log("response", response);
      respo = response;
    } );
    return respo;

  }
  async signIn(data) {
    const httpOptions: { headers; observe; } = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      observe: 'response'
    };

    var respo = null;
    var res = await this.http.post('http://localhost:8000/loginuser', data, httpOptions);
    setTimeout( () => {  }, 500 );
    await res.toPromise().then(response =>{
      respo = response;
    } );
    return respo;
  }
}
