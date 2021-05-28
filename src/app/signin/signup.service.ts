import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  getList() {
    return this.http.get('http://localhost:3000/account');
  }
  saveData(data) {
    return this.http.post('http://localhost:3000/account', data);
  }
}
