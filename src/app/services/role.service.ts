import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const urlMapping = '/roles';
const urlBase = environment.serviceURL;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private urlApi = urlBase + urlMapping;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.urlApi);
  }

}
