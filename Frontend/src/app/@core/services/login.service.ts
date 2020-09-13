import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JWT} from '../model/LogedUserData';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }


  login(user): Observable<Response> {
    return this.http.post<Response>('http://localhost:6969/auth', user);
  }

  isLoggedIn(): Observable<Response> {
    return this.http.get<Response>('http://localhost:6969/auth');
  }
  getToken(): string {
    return localStorage.getItem('jwt');
  }

  myInfo(): Observable<any> {
    return this.http.get<any>('http://localhost:6969/agent/me/user/1');
  }

  register(user): Observable<Response> {
    return this.http.post<Response>('http://localhost:6969/reg', user);
  }


}
