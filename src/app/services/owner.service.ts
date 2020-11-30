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
    }),
    responseType: 'text' as 'json',
  };

  async getAllOwners(): Promise<Owner[]> {
    return await this.http
      .get<Owner[]>(this.urlApi)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getOwner(id: string) {
    return this.http
      .get(this.urlApi + '/' + id);
  }

  async createOwner(employee: NewOwnerRequests): Promise<any> {
    return await this.http
      .post<any>(this.urlApi, JSON.stringify(employee), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async removeOwner(id: string) {
    return this.http.delete(this.urlApi + '/' + id);
  }

  async updateOwner(id: number, employee: UpdateOwnerRequests): Promise<any> {
    return await this.http
      .put(this.urlApi + '/' + id, employee)
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
