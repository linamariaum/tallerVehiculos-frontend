import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const urlMapping = '/roles';
const urlBase = environment.serviceURL;

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private urlApi = urlBase + urlMapping;

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + sessionStorage.getItem('cod'),
    }),
    responseType: 'text' as 'json',
  };

  getAll(): Observable<any> {
    return this.http.get(this.urlApi, this.httpOptions);
  }
}
