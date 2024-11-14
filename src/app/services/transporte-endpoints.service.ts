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

    getTipoTransporte(): Observable<BaseResponse<Transporte[]>> {
      return this._http.get<BaseResponse<Transporte[]>>('http://3.90.157.39:8082/tipotransporte/traer').pipe(
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(() => 'Error fetching data')
        })
      )
    }
  
}
