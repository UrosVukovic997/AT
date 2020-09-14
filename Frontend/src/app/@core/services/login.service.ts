import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Observer, Subject} from 'rxjs';
import {JWT} from '../model/LogedUserData';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private subject: Subject<MessageEvent>;
  private subject2: Subject<MessageEvent>;

  private ws1: WebSocket;
  private ws2: WebSocket;
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
      this.subject = this.create(url, 0);
      console.log('Successfully connected: ' + url);
    }
    return this.subject;
  }

  public connectOnline(url): Subject<MessageEvent> {
    if (!this.subject2) {
      this.subject2 = this.create(url, 1);
      console.log('Successfully connected: ' + url);
    }
    return this.subject2;
  }

  private create(url, i): Subject<MessageEvent> {
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
    if (i){
      this.ws2 = ws;
    }
    else {
      this.ws1 = ws;
    }

    return Subject.create(observer, observable);
  }
  public disconect() {
    this.ws1.close();
  }
}
