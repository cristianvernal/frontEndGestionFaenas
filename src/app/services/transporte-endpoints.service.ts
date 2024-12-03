import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { BaseResponse } from '../interfaces/baseResponse';
import { Transporte } from '../interfaces/transporte';
import { HttpClient } from '@angular/common/http';
import { HotelDTO } from '../interfaces/hotel-dto';
import { HabitacionesDTO } from '../interfaces/habitaciones-dto';
import { LogisticaDTO } from '../interfaces/logistica-dto';

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

    getHotel(): Observable<BaseResponse<HotelDTO[]>> {
      return this._http.get<BaseResponse<HotelDTO[]>>('https://alojamiento.sistemagf.cl/hotel/traer').pipe(
        catchError(error => {
          console.error('Error fetching Hotel: ', error);
          return throwError(() => 'Error Fetching hotel')
        })
      )
    } 

    getHabitaciones(idHotel: number): Observable<BaseResponse<HabitacionesDTO[]>> {
      return this._http.get<BaseResponse<HabitacionesDTO[]>>(`https://alojamiento.sistemagf.cl/habitacion/traerporhotel/${idHotel}`, ).pipe(
        catchError(error => {
          console.error('Error fetching habitaciones: ', error);
          return throwError(() => 'Error fetching habitaciones')
        })
      )
    }

    getLogistic(logistica: LogisticaDTO) {
      return this._http.post(`https://trabajadores.sistemagf.cl/api/registros/registro/Alojamientotransporte`, logistica).pipe(
        catchError(error => {
          console.error('Error fetching logistic: ', error);
          return throwError(() => 'Error fetching logistic')
        })
      )
    }

    updateRoomState(idHabitacion: number, idEstado: number) {
      return this._http.patch(`https://alojamiento.sistemagf.cl/${idHabitacion}/estado/${idEstado}`, null).pipe(
        catchError(error => {
          console.error('Error fetching room state: ', error);
          return throwError(() => 'Error fetching room state')
        })
      )
    }
}
