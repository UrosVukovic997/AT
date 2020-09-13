import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getAgentData(): Observable<any> {
    return this.http.get<any>('http://localhost:6969/agent/me/user/1');
  }

  update(agent, id): Observable<any> {
    return this.http.put<any>('http://localhost:6969/agent/' + id, agent);
  }
}
