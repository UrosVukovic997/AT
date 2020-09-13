import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }


  getConversations(): Observable<any> {
    return this.http.get<any>('http://localhost:6969/conversation/', {
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getMassages(): Observable<any> {
    return this.http.get<any>('http://localhost:6969/message/', {
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  sendMessage(body): Observable<any> {
    return this.http.post<any>('http://localhost:6969/message', body);
  }

  getUser(id): Observable<any> {
    return this.http.get<any>('http://localhost:6969/user/' + id, {
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
