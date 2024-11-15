import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { CrearTrabajadorDTO } from '../interfaces/crearTrabajadorDTO';
import { BaseResponse } from '../interfaces/baseResponse';
import { Cargo } from '../interfaces/cargo';

@Injectable({
  providedIn: 'root'
})
export class RegisterApiService {

  private readonly _http = inject(HttpClient);

  readonly API_URL = "http://3.90.157.39:8081/trabajadores";

  createTrabajador(trabajador: CrearTrabajadorDTO): Observable<BaseResponse<any>> {
    return this._http.post<BaseResponse<any>>(`${this.API_URL}/crear`, trabajador).pipe(
      catchError(error => {
        console.error('Error creating faena:', error);
        return throwError(() => new Error('Error creating faena'));
      })
    );
  }

  getTipoCargo(): Observable<BaseResponse<Cargo[]>> {
    return this._http.get<BaseResponse<Cargo[]>>("http://3.90.157.39:8081/cargos/traer").pipe(
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => 'Error fetching data')
      })
    )
}

  identifyPicture(pictureImg: string): Observable<any> {
    const formData = new FormData()
    const worker = {
      nombre: 'Juan',
    apellido: 'Pérez',
    rut: '12345678-9',
    fechaNacimiento: '1990-01-01',
    direccion: '123 Calle Falsa',
    fechaContratacion: new Date(),
    telefono: '123456789',
    email: 'juan.perez@example.com',
    hospedaje: '',
    cargo: 'Pintor',
    faena: '',
    fotoUrl: 'img/istockphoto-1386479313-612x612.jpg',
    }
    formData.append('file', this.convertImageBase64ToBlob(pictureImg))
    return this._http.post<string>('http://3.90.157.39:8083/api/rekognition/identify', formData, {observe: 'response'}).pipe(
      map(res => {
        console.log('identifyPictureRes: ', res)
        return worker
      }), 
      catchError((error: HttpResponse<any>) => {
        if(error.status == 404) {
          return of(undefined)
        }
        console.error('Error fetching data :', error);
        return throwError(() => 'Error fetching data')
      })
    )
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
}
