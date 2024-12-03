import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RegistroAsistencia } from '../interfaces/registro-asistencia';
import { AttendanceByDay } from '../interfaces/attendance-by-day';
import { AsistenciaResponse } from '../interfaces/asistencia-response';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  private readonly _http = inject(HttpClient);

  readonly API_URL = 'https://asistencia.sistemagf.cl'

  attendanceByDay(registro: AttendanceByDay): Observable<AsistenciaResponse[]> {
    return this._http.post<AsistenciaResponse[]>(`${this.API_URL}/diario`, registro).pipe(
      catchError((error) => {
        console.error('Error fetching data: ', error);
        return throwError(() => new Error('Error fetching data'));
      })
    );
  }

  
}
