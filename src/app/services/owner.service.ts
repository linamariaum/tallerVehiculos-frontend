import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { Owner } from '../models/Owner';
import { NewOwnerRequests } from '../models/dataRequests/newOwner';
import { UpdateOwnerRequests } from '../models/dataRequests/updateOwner';

const urlMapping = '/owners';
const urlBase = environment.serviceURL;

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private urlApi = urlBase + urlMapping;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'bearer '+sessionStorage.getItem('cod')
    }),
    responseType: 'text' as 'json',
  };

  async getAllOwners(): Promise<any> {
    return await this.http
      .get<any>(this.urlApi, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getOwner(id: number): Promise<any> {
    return this.http
      .get<any>(this.urlApi + '/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getOwnerShowDetails(id: string, token: string): Promise<any> {
    return this.http
      .get<any>(this.urlApi + '/showDetails/' + id + '?token=' + token)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  // email, password
  async loginOwner(ownerLogin: any) {
    return await this.http
      .post<any>(urlBase+'/auth/token', JSON.stringify(ownerLogin), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async createOwner(employee: NewOwnerRequests): Promise<any> {
    return await this.http
      .post<any>(this.urlApi, JSON.stringify(employee), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async removeOwner(id: string) {
    return this.http.delete(this.urlApi + '/' + id, this.httpOptions);
  }

  async updateOwner(id: number, employee: UpdateOwnerRequests): Promise<any> {
    return await this.http
      .put(this.urlApi + '/' + id, employee, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  // Error handling
  handleError(error) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      errorMessage = error;
    }
    return throwError(errorMessage);
  }
}
