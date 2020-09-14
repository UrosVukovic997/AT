import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Ad} from '../model/Ad';
import {LoginService} from './login.service';
import {map} from 'rxjs/operators';

const CHAT_URL = 'ws://localhost:8080/AT-Chat-war/wsMessage';
const AGENT_URL = 'ws://localhost:8080/AT-Chat-war/ws';

export interface Message {
  receivers: any[];
  sender: any;
  performative: string;
  content: string;
}

export interface UserEvent {
  id: any[];
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  public messages: Subject<Message>;
  public agents: Subject<UserEvent>;
  constructor(private http: HttpClient, private service: LoginService) {


    this.messages = (service.connect(CHAT_URL).pipe(map(
      (response: MessageEvent): Message => {
        const data = JSON.parse(response.data);
        return {
          receivers: data.receivers,
        sender: data.sender,
        performative: data.performative,
        content: data.content
        };
      }
    )) as Subject<any>);

    this.agents = (service.connectOnline(AGENT_URL).pipe(map(
      (response: MessageEvent): UserEvent => {
        // const data = JSON.parse(response.data);
        return {
          id: response.data
        };
      }
    )) as Subject<UserEvent>);
  }
  getAllVendors(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/AT-Chat-war/rest/messages');
  }
  getModelsByVendor(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/AT-Chat-war/rest/agents/running');
  }

  addVehicle(vehicle): Observable<any> {
    return this.http.post<any>('http://localhost:8080/AT-Chat-war/rest/messages', vehicle);
  }
/*
  getHeaders() {
    const userToken = localStorage.getItem('jwt');

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    headers.append('Authorization', 'Bearer ' + userToken);

    return headers;
  }
  getAllClients(): Observable<Response> {
    return this.http.get<Response>('http://localhost:6969/client', this.getHeaders());
  }
*/

  getAllVehicle(): Observable<any> {
    return this.http.get<any>('http://localhost:6969/vehicles/');
  }

  deleteVehicle(id): Observable<any> {
    return this.http.delete<any>('http://localhost:6969/vehicles/' + id);
  }

  getVehicle(id): Observable<any> {
    return this.http.get<any>('http://localhost:6969/vehicles/' + id);
  }
}
