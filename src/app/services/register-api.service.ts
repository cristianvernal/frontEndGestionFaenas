import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CrearTrabajadorDTO } from '../interfaces/crearTrabajadorDTO';
import { BaseResponse } from '../interfaces/baseResponse';

@Injectable({
  providedIn: 'root'
})
export class RegisterApiService {

  private readonly _http = inject(HttpClient);

  readonly API_URL = "http://3.90.157.39:8081/trabajadores";

  createTrabajador(trabajador: CrearTrabajadorDTO): Observable<BaseResponse> {
    return this._http.post<BaseResponse>(`${this.API_URL}/crear`, trabajador).pipe(
      catchError(error => {
        console.error('Error creating faena:', error);
        return throwError(() => new Error('Error creating faena'));
      })
    );
  }
}
