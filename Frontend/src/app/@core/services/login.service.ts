import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer, Subject} from 'rxjs';
import {JWT} from '../model/LogedUserData';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private subject: Subject<MessageEvent>;

  private ws1: WebSocket;
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

  public connect(url): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected: ' + url);
    }
    return this.subject;
  }

  private create(url): Subject<MessageEvent> {
    const ws = new WebSocket(url);

    const observable = Observable.create((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    const observer = {
      // tslint:disable-next-line:ban-types
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    this.ws1 = ws;

    return Subject.create(observer, observable);
  }
  public disconect() {
    this.ws1.close();
  }
}
