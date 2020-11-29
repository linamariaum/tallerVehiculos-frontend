import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { Employee } from '../models/employee';
import { NewEmployeeRequests } from '../models/dataRequests/newEmployee';
import { UpdateEmployeeRequests } from '../models/dataRequests/updateEmployee';

const urlMapping = '/employees';
const urlBase = environment.serviceURL;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private urlApi = urlBase + urlMapping;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: 'text' as 'json',
  };

  async getAllEmployees(): Promise<Employee[]> {
    return await this.http
      .get<Employee[]>(this.urlApi)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getEmployee(id: string) {
    return this.http
      .get(this.urlApi + '/' + id);
  }

  async createEmployee(employee: NewEmployeeRequests): Promise<any> {
    return await this.http
      .post<any>(this.urlApi, JSON.stringify(employee), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async removeEmployee(id: string) {
    return this.http.delete(this.urlApi + '/' + id);
  }

  async updateEmployee(employee: UpdateEmployeeRequests): Promise<any> {
    return await this.http
      .put(this.urlApi + '/' + employee.id, employee)
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
