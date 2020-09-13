import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Ad} from '../model/Ad';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyAdsService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Ad> {
    return this.http.get<Ad>('http://localhost:6969/ad/');
  }
  getMyAds(): Observable<Ad> {
    return this.http.get<Ad>('http://localhost:6969/ad/agent/1');
  }
  createAd(ad): Observable<any> {
    return this.http.put<any>('http://localhost:8080/AT-Chat-war/rest/agents/running/' + ad.agent + '/' + ad.name, null);
  }

  getAllByVehicle(id): Observable<Ad> {
    return this.http.get<Ad>('http://localhost:6969/ad/vehicle/' + id);
  }
}
