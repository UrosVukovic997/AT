import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {

  constructor(private http: HttpClient) { }

  createDis(dis): Observable<any> {
    return this.http.post<any>('http://localhost:6969/discount', dis);
  }

  deleteDis(id): Observable<any> {
    return this.http.delete<any>('http://localhost:6969/discount/' + id);
  }

  getDis(): Observable<any> {
    return this.http.get<any>('http://localhost:6969/discount');
  }
}
