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
      Authorization: 'bearer ' + sessionStorage.getItem('cod'),
    }),
    responseType: 'text' as 'json',
  };

  async getVehicles(): Promise<any> {
    return await this.http
      .get<Vehicle[]>(this.urlApi, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getVehicle(id: string): Promise<any> {
    return await this.http
      .get<Vehicle>(this.urlApi + '/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getStates(): Promise<any> {
    return await this.http
      .get<any[]>(urlBase + '/states', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getEmployees(): Promise<any> {
    return await this.http
      .get<any[]>(urlBase + '/employees', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getOwners(): Promise<any> {
    return await this.http
      .get<any[]>(urlBase + '/owners', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getVehiclesByTechnicalId(id: number): Promise<any> {
    return await this.http
      .get<any[]>(urlBase + '/vehicleStates/mechanical/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getTechnicalByVehiclesId(id: string): Promise<any> {
    return await this.http
      .get<any[]>(urlBase + '/vehicleStates/vehicle/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getOwnerByVehiclesId(id: string): Promise<any> {
    return await this.http
      .get<any[]>(urlBase + '/vehicleXowners/owner/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async getVehicleTypes(): Promise<any> {
    return await this.http
      .get<any[]>(urlBase + '/vehicleTypes', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async createVehicle(vehicle: any): Promise<any> {
    return await this.http
      .post<any>(this.urlApi, JSON.stringify(vehicle), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async vehicleXTechnical(vehicleStates: any): Promise<any> {
    return await this.http
      .post<any>(
        urlBase + '/vehicleStates',
        JSON.stringify(vehicleStates),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async vehicleXOwner(vehicleXOwner: any): Promise<any> {
    return await this.http
      .post<any>(
        urlBase + '/vehicleXOwners',
        JSON.stringify(vehicleXOwner),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async deleteVehicle(idVehicle: string): Promise<any> {
    return await this.http
      .delete(this.urlApi + '/' + idVehicle, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();
  }

  async updateVehicle(id: string, vehicle: any): Promise<any> {
    return await this.http
      .put(this.urlApi + '/' + id, vehicle, this.httpOptions)
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
