import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';

//const urlMapping = '/auth/login';
const urlMapping = '/employees/tests';
const urlBase = environment.serviceURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlApi = urlBase + urlMapping;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    responseType: 'text' as 'json'
  };

  async getUser(login: any): Promise<any> {
    return await this.http.post<any>(this.urlApi, JSON.stringify(login), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
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
