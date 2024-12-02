import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { CrearTrabajadorDTO } from '../interfaces/crearTrabajadorDTO';
import { BaseResponse } from '../interfaces/baseResponse';
import { Cargo } from '../interfaces/cargo';
import { TipoRegistro } from '../interfaces/tipoRegistro';
import { RegistroAsistencia } from '../interfaces/registro-asistencia';
import { CumplimientoDTO } from '../interfaces/cumplimiento-dto';
import { RegistroDTO } from '../interfaces/registro-dto';
import { TipoCumplimiento } from '../interfaces/tipo-cumplimiento';
import { Workers } from '../interfaces/workers-dto';
import { ACtualizarEstado } from '../interfaces/nuevo-cumplimiento';
import { AttendanceTableDTO } from '../interfaces/attendance-table';
import { combineLatestInit } from 'rxjs/internal/observable/combineLatest';

@Injectable({
  providedIn: 'root',
})
export class RegisterApiService {
  private readonly _http = inject(HttpClient);

  readonly API_URL = 'https://trabajadores.sistemagf.cl';
  readonly API_URL_IMAGE = 'https://asistencia.sistemagf.cl';
  readonly API_URL_REGISTER = 'https://3.90.157.39:8083';

  createTrabajador(
    trabajador: CrearTrabajadorDTO,
    image: string
  ): Observable<any> {
    const request = {
      worker: this._http
        .post<BaseResponse<any>>(`${this.API_URL}/trabajadores/crear`, trabajador)
        .pipe(
          catchError((error) => {
            console.error('Error creating faena:', error);
            return throwError(() => new Error('Error creating faena'));
          })
        ),
      imageRegister: this.savePictureRegister(trabajador.run, image),
      imageRegisterLocal: this.savePictureRegisterLocal(trabajador.run, image),
    };
    return forkJoin(request);
  }

  getTipoCargo(): Observable<BaseResponse<Cargo[]>> {
    return this._http
      .get<BaseResponse<Cargo[]>>(`${this.API_URL}/cargos/traer`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching data:', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  getTipoRegistro(): Observable<BaseResponse<TipoRegistro[]>> {
    return this._http
      .get<BaseResponse<TipoRegistro[]>>(
        'https://asistencia.sistemagf.cl/tiporegistro/traer'
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching data:', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  createAsistencia(registro: RegistroAsistencia) {
    return this._http
      .post('https://asistencia.sistemagf.cl/registroasistencia/crear', registro)
      .pipe(
        catchError((error) => {
          console.error('Error fetching data:', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  getAsistencia(termsSearch: {rut?: string, faena?: number, fecha?: Date }): Observable<AttendanceTableDTO[]> {
    return this._http.get<BaseResponse<RegistroAsistencia[]>>('https://asistencia.sistemagf.cl/registroasistencia/traer').pipe(
      switchMap((res) => {
        console.log('attendaceListResponse: ', res);
        const request: Observable<any>[] = []
        res.resultado.forEach(attendance => {
          request.push(this.getTrabajadorRut(attendance.runTrabajador).pipe(map(worker => {
            const attendanceTable: AttendanceTableDTO = {
              nombre: worker?.primerNombre,
              apellido: worker?.primerApellido,
              rut: attendance.runTrabajador,
              fecha: attendance.fecha,
              hora: attendance.hora,
              tipoMarcaje: attendance.tipoMarcaje,
              idFaena: attendance.idFaena,
              idRegistro: attendance.idRegistro as number,
              fechaEntrada: '',
              fechaSalida: '',
            }
            return attendanceTable
          })))
        })  
        return combineLatest<AttendanceTableDTO[]>(request)
      }),
      switchMap(attendanceTable => {
        const grouped: Record<string, AttendanceTableDTO> = {}
        attendanceTable.forEach(attendance => {
          const key = attendance.fecha + '-' + attendance.rut
          const fecha = attendance.fecha.split('T')[0] + ' ' + attendance.hora
          console.log('Key: ', key) 
          if(!grouped[key]) {
            grouped[key] = attendance
          }
          if(attendance.tipoMarcaje.tipoRegistro == 'Entrada faena') {
            grouped[key].fechaEntrada = fecha
          } else {
            grouped[key].fechaSalida = fecha
          }           
        })
        console.log('grouped: ', grouped)
        const list = Object.values(grouped)
        return of(list)
      }),
      switchMap(attendaceTable => {
        let newList = attendaceTable
        if(termsSearch.rut) {
          newList = newList.filter(attendance => attendance.rut == termsSearch.rut)
        } 
        if(termsSearch.faena) {
          newList = newList.filter(attendance => attendance.idFaena == termsSearch.faena)
        }
        if(termsSearch.fecha) {
           newList = newList.filter(attendance => attendance.fecha.split('T')[0] == termsSearch.fecha?.toISOString().split('T')[0])
        }
        return of(newList)
      }), 
      catchError((error) => {
        console.error('Error fetching asistencia: ', error);
        return throwError(() => 'Error fetching asistencia');
      })
    )
  }

  createCumplimiento(cumplimento: CumplimientoDTO) {
    return this._http
      .post('https://trabajadores.sistemagf.cl/registro/crear', cumplimento)
      .pipe(
        catchError((error) => {
          console.error('Error fetching data: ', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  getCumplimiento(): Observable<BaseResponse<TipoCumplimiento[]>> {
    return this._http
      .get<BaseResponse<TipoCumplimiento[]>>(
        'https://trabajadores.sistemagf.cl/tipocumplimiento/traer'
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching data:', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  updateNewRegister(registro: Workers, idCumplimiento: number) {
    return this._http.put(`${this.API_URL}/api/registros/actualizar/${registro.run}/${registro.idFaena}/${idCumplimiento}`, registro).pipe(
      catchError((error) => {
        console.error('Error fetching new register state: ', error);
        return throwError(() => 'Error fetching new register state');
      })
    )
  }

  getRegistro(registro: RegistroDTO) {
    return this._http
      .post<Workers[]>(
        'https://trabajadores.sistemagf.cl/api/registros/registro/traer',
        registro
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching data: ', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  getRegistroAprobados(registro: RegistroDTO) {
    return this._http
      .post<Workers[]>(
        `https://trabajadores.sistemagf.cl/api/registros/registro/traerAprobados/{idFaena}?idFaena=${registro.faena}`,
        registro
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching data: ', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  identifyPicture(pictureImg: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', this.convertImageBase64ToBlob(pictureImg));
    return this._http
      .post('https://asistencia.sistemagf.cl/api/rekognition/identify', formData, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        switchMap((res) => {
          console.log('identifyPictureRes: ', res);
          const workerId = res.body?.split(': ')[1] as string;
          console.log(workerId);
          return this.getTrabajadorRut(workerId);
        }),
        catchError((error: HttpResponse<any>) => {
          if (error.status == 404) {
            return of(undefined);
          }
          console.error('Error fetching data :', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  private convertImageBase64ToBlob(imagebs64: string): Blob {
    const byteString = atob(imagebs64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }

  getTrabajadorRut(rut: string): Observable<CrearTrabajadorDTO> {
    return this._http
      .get<CrearTrabajadorDTO>(
        `${this.API_URL}/trabajadores/traer/run/{run}?run=${rut}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error Fetching data: ', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  getTrabajadores(): Observable<BaseResponse<CrearTrabajadorDTO>> {
    return this._http
      .get<BaseResponse<CrearTrabajadorDTO>>(`${this.API_URL}/trabajadores/traer`)
      .pipe(
        catchError((error) => {
          console.error('Error Fetching data: ', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  updateTrabajadores(worker: CrearTrabajadorDTO) {
    return this._http.put(`${this.API_URL}/trabajadores/editar/`, worker).pipe(
      catchError(error => {
        console.error('Error updating worker: ', error)
        return throwError(() => 'Error updating worker');
      })
    )
  }

  deleteTrabajadores(trabajador: CrearTrabajadorDTO): Observable<any> {
    const request = {
      deleteWorker: this._http.delete<BaseResponse<any>>(`${this.API_URL}/trabajadores/borrar/${trabajador.idTrabajador}`).pipe(
        catchError(error => {
          console.error('Error deleting Trabajador: ', error)
          return throwError(() => new Error('Error deleting trabajador'))
        })
      ),
      deleteLocalImage: this.deleteLocalImage(trabajador),
      deleteRekognitionImage: this.deleteRekognitionImage(trabajador),
    }
    return combineLatest(request)

  }


  deleteLocalImage(trabajador: CrearTrabajadorDTO): Observable<any> {
    return this._http.delete(`${this.API_URL_IMAGE}/api/rekognition/workers/delete-local/${trabajador.run}.jpg.jpg`,
      {responseType: 'text'}
    ).pipe(
      catchError(error => {
        console.error('Error deleting Trabajador: ', error)
        return throwError(() => new Error('Error deleting trabajador'))
      })
    )
  }

  deleteRekognitionImage(trabajador: CrearTrabajadorDTO): Observable<any> {
    return this._http.delete(`${this.API_URL_IMAGE}/api/rekognition/delete-worker-image/${trabajador.run}`,
      {responseType: 'text'}
    ).pipe(
      catchError(error => {
        console.error('Error deleting Trabajador: ', error)
        return throwError(() => new Error('Error deleting trabajador'))
      })
    )
  }



  getTrabajadorByPhoto(
    rut: string
  ): Observable<BaseResponse<CrearTrabajadorDTO>> {
    return this._http
      .get<BaseResponse<CrearTrabajadorDTO>>(
        `https://asistencia.sistemagf.cl/images/${rut}.jpg`
      )
      .pipe(
        catchError((error) => {
          console.error('Error Fetching data: ', error);
          return throwError(() => 'error Fetching data');
        })
      );
  }

  savePictureRegister(workerId: string, pictureImg: string) {
    const formData = new FormData();
    formData.append('file', this.convertImageBase64ToBlob(pictureImg));
    return this._http
      .post(
        `https://asistencia.sistemagf.cl/api/rekognition/register?workerId=${workerId}`,
        formData,
        { observe: 'response', responseType: 'text' }
      )
      .pipe(
        map((res) => {
          console.log('savePictureRegister: ', res);
        }),
        catchError((error: HttpResponse<any>) => {
          if (error.status == 404) {
            return of(undefined);
          }
          console.error('savePictureRegister :', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  savePictureRegisterLocal(workerId: string, pictureImg: string) {
    const formData = new FormData();
    formData.append('file', this.convertImageBase64ToBlob(pictureImg));
    return this._http
      .post(
        `https://asistencia.sistemagf.cl/api/rekognition/register-local?workerId=${workerId}`,
        formData,
        { observe: 'response', responseType: 'text' }
      )
      .pipe(
        map((res) => {
          console.log('savePictureRegisterLocal: ', res);
        }),
        catchError((error: HttpResponse<any>) => {
          if (error.status == 404) {
            return of(undefined);
          }
          console.error('savePictureRegisterLocal :', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }
}
