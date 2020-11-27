import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { Vehicle } from '../models/vehicle';

const urlMapping = '/vehicles';
const urlBase = environment.serviceURL;

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private urlApi = urlBase + urlMapping;

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: 'text' as 'json',
  };

  async getVehicles(): Promise<Vehicle[]> {
    return await this.http
      .get<Vehicle[]>(this.urlApi)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getVehicle(id: string): Promise<Vehicle> {
    return await this.http
      .get<Vehicle>(this.urlApi + '/' + id)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async createVehicle(vehicle: any): Promise<any> {
    return await this.http
      .post<any>(this.urlApi, JSON.stringify(vehicle), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async deleteVehicle(idVehicle: string) {
    return await this.http
      .delete(this.urlApi + '/' + idVehicle)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async updateVehicle(vehicle: any) {
    return await this.http
      .put(this.urlApi + '/' + vehicle.id, vehicle)
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
