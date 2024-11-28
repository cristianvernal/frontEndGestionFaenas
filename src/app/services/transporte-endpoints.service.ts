import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { BaseResponse } from '../interfaces/baseResponse';
import { Transporte } from '../interfaces/transporte';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransporteEndpointsService {

  private readonly _http = inject(HttpClient);
  readonly API_URL = "https://api.openweathermap.org/data/2.5/weather";
  readonly apiKey = "11be8d1c0d1bbcb93c9e68f87bbce43b"

    getTipoTransporte(): Observable<BaseResponse<Transporte[]>> {
      return this._http.get<BaseResponse<Transporte[]>>('https://traslado.sistemagf.cl/tipotransporte/traer').pipe(
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(() => 'Error fetching data')
        })
      )
    }

    getClima(): Observable<any> {
     return this._http.get(`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=${this.apiKey}`).pipe(
      catchError(error => {
        console.error('Error fetching data: ', error);
        return throwError(() => 'Errorfetching data')
      })
     )
    }
}
