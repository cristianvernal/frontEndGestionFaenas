import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { CrearTrabajadorDTO } from '../interfaces/crearTrabajadorDTO';
import { RegistroAsistencia } from '../interfaces/registro-asistencia';
import { BaseResponse } from '../interfaces/baseResponse';

@Injectable({
  providedIn: 'root'
})
export class AttendanceEndpointService {

  private readonly _http = inject(HttpClient);

  readonly API_URL = 'http://3.90.157.39:8081/trabajadores';

  getWorkerByFaenaId(idFaena: number): Observable<CrearTrabajadorDTO[]> {
    return this._http
      .get<BaseResponse<RegistroAsistencia[]>>(
        `http://3.90.157.39:8083/registroasistencia/traerPorFaena/{idFaena}?idFaena=${idFaena}`
      )
      .pipe(
        switchMap((res) => {
          const workerList: CrearTrabajadorDTO[] = []
          const request: Observable<any>[] = []
          const attendanceList: RegistroAsistencia[] = res.resultado
          attendanceList.forEach((attendance) => {
            request.push(this.getTrabajadorRut(attendance.runTrabajador).pipe(tap(res => console.log('getTrabajadorRut: ', res))))
          })
          return forkJoin(request).pipe(tap(res => console.log('forkJoin: ', res)));
        }),
        catchError((error) => {
          console.error('Error fetching data :', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  getTrabajadorRut(rut: string): Observable<CrearTrabajadorDTO> {
    return this._http
      .get<CrearTrabajadorDTO>(
        `${this.API_URL}/traer/run/{run}?run=${rut}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error Fetching data: ', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }
}
