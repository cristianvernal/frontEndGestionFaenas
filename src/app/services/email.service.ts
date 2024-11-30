import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EmailDTO } from '../interfaces/email-dto';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private readonly _http = inject(HttpClient)

  private readonly API_URL = "https://notificaciones.sistemagf.cl";

  sendEmail( email: EmailDTO[]): Observable<any> {
    return this._http.post(`${this.API_URL}/enviarCorreos`, email, {
      observe: 'response', responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Error sending email: ', error);
        return throwError(() => 'Error sending email');
      })
    )
  }

}
