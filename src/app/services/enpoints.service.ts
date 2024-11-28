import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Faena } from '../interfaces/faenas';
import { FaenaDto } from '../interfaces/faena-dto';
import { BaseResponse } from '../interfaces/baseResponse';
import { TipoFaena } from '../interfaces/tipoFaena';
import { EditFaenaDto } from '../interfaces/faena-edit-dto';

 

@Injectable({
  providedIn: 'root'
})
export class EnpointsService {

  private readonly _http = inject(HttpClient);

  readonly API_URL = "https://faenas.sistemagf.cl"
  

  getFaenas(): Observable<BaseResponse<Faena[]>> {
    return this._http.get<BaseResponse<Faena[]>>(`${this.API_URL}/faena/traer`).pipe(
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Error fetching data'));
      })
    );
  }

  getTipoFaena(): Observable<BaseResponse<TipoFaena[]>> {
      return this._http.get<BaseResponse<TipoFaena[]>>(`${this.API_URL}/tipofaena/traer`).pipe(
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(() => 'Error fetching data')
        })
      )
  }

  createFaena(faena: FaenaDto): Observable<string> {
    return this._http.post<string>(`${this.API_URL}/faena/crear`, faena).pipe(
      catchError(error => {
        console.error('Error creating faena:', error);
        return throwError(() => new Error('Error creating faena'));
      })
    );
  }
  
  updateFaena(faena: EditFaenaDto): Observable<Faena> {
    return this._http.put<Faena>(`${this.API_URL}/faena/editar`, faena).pipe(
      catchError(error => {
        console.error('Error updating faena:', error);
        return throwError(() => new Error('Error updating faena'));
      })
    );
  }

  deleteFaena(faena: Faena): Observable<BaseResponse<any>> {
    return this._http.delete<BaseResponse<any>>(`${this.API_URL}/faena/borrar/${faena.idFaena}`).pipe(
      catchError(error => {
        console.error('Error deleting faena:', error);
        return throwError(() => new Error('Error deleting faena'));
      })
    );
  }
}
