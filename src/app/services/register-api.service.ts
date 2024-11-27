import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
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

@Injectable({
  providedIn: 'root',
})
export class RegisterApiService {
  private readonly _http = inject(HttpClient);

  readonly API_URL = 'https://3.90.157.39:8081/trabajadores';

  createTrabajador(
    trabajador: CrearTrabajadorDTO,
    image: string
  ): Observable<any> {
    const request = {
      worker: this._http
        .post<BaseResponse<any>>(`${this.API_URL}/${'crear'}`, trabajador)
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
      .get<BaseResponse<Cargo[]>>('https://3.90.157.39:8081/cargos/traer')
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
        'https://3.90.157.39:8083/tiporegistro/traer'
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
      .post('https://3.90.157.39:8083/registroasistencia/crear', registro)
      .pipe(
        catchError((error) => {
          console.error('Error fetching data:', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  createCumplimiento(cumplimento: CumplimientoDTO) {
    return this._http
      .post('https://3.90.157.39:8081/registro/crear', cumplimento)
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
        'https://3.90.157.39:8081/tipocumplimiento/traer'
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching data:', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  getRegistro(registro: RegistroDTO) {
    return this._http
      .post<Workers[]>(
        'https://3.90.157.39:8081/api/registros/registro/traer',
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
        `https://3.90.157.39:8081/api/registros/registro/traerAprobados/${registro.faena}`,
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
      .post('https://3.90.157.39:8083/api/rekognition/identify', formData, {
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

  getTrabajadorRut(rut: string): Observable<BaseResponse<CrearTrabajadorDTO>> {
    return this._http
      .get<BaseResponse<CrearTrabajadorDTO>>(
        `${this.API_URL}/traer/run/{run}?run=${rut}`
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
      .get<BaseResponse<CrearTrabajadorDTO>>(`${this.API_URL}/traer`)
      .pipe(
        catchError((error) => {
          console.error('Error Fetching data: ', error);
          return throwError(() => 'Error fetching data');
        })
      );
  }

  getTrabajadorByPhoto(
    rut: string
  ): Observable<BaseResponse<CrearTrabajadorDTO>> {
    return this._http
      .get<BaseResponse<CrearTrabajadorDTO>>(
        `https://3.90.157.39:8083/images/${rut}.jpg`
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
        `https://3.90.157.39:8083/api/rekognition/register?workerId=${workerId}`,
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
        `https://3.90.157.39:8083/api/rekognition/register-local?workerId=${workerId}`,
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
