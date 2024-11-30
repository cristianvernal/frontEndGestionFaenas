import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { WebcamComponent } from '../../components/webcam/webcam.component';
import { EnpointsService } from '../../services/enpoints.service';
import { RegisterApiService } from '../../services/register-api.service';
import { CrearTrabajadorDTO } from '../../interfaces/crearTrabajadorDTO';
import { Subject } from 'rxjs';
import { SelectOption } from '../../interfaces/select-option';
import { TipoRegistro } from '../../interfaces/tipoRegistro';
import { Faena } from '../../interfaces/faenas';
import Swal from 'sweetalert2';
import { RegistroAsistencia } from '../../interfaces/registro-asistencia';

@Component({
  selector: 'app-salida',
  standalone: true,
  imports: [MatDividerModule, FormsModule, MatSelectModule, MatButtonModule, WebcamComponent, ReactiveFormsModule],
  templateUrl: './salida.component.html',
  styleUrl: './salida.component.css'
})
export class SalidaComponent implements OnInit {
  faenaService = inject(EnpointsService);
  registeApiService = inject(RegisterApiService);
  scanFail = false;
  trabajador: CrearTrabajadorDTO | undefined;
  webcam = viewChild.required(WebcamComponent);
  triggerSource = new Subject<void>();
  tipoRegistroList: SelectOption<TipoRegistro>[] = [];
  faenas: SelectOption<Faena>[] = [];
  tipoRegistro = new FormControl<TipoRegistro | null>(null, Validators.required)
  tipoFaena = new FormControl<Faena | null>(null, Validators.required)

  ngOnInit(): void {
    this.getNombreFaena();
    this.getTipoRegistro();
  }

  get trigger() {
    return this.triggerSource.asObservable();
  }

  onScanWorker() {
    this.triggerSource.next();
  }

  ingresarFaena() {
    if(this.trabajador == undefined) {
      return
    } 
    if(this.tipoRegistro.invalid){
      return
    }
    if(this.tipoFaena.invalid) {
      return
    }
    const registroAsistencia: RegistroAsistencia = {
      runTrabajador: this.trabajador?.run as string,
      fecha: new Date(),
      hora: new Date(),
      tipoRegistroJoin: this.tipoRegistro.value as TipoRegistro,
      idFaena: this.tipoFaena.value?.idFaena as number,
      tipoMarcaje: {
        idTipoRegistro: 4,
        tipoRegistro: "Salida faena.",
      }
    }
    console.log('Registro asistencia: ', registroAsistencia)
    this.registeApiService.createAsistencia(registroAsistencia).subscribe({
      next: (data: any) => {
        if (data) {
          Swal.fire({
            icon: 'success',
            text: 'Trabajador Ingresado',
            confirmButtonText: 'OK'
          })
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          text: 'Trabajador no Ingresado',
          confirmButtonText: 'Ok'
        })
      }
    })
    this.webcam().onCleanImage()
    this.trabajador = undefined
    // this.tipoRegistro.setValue(null)
    // this.tipoFaena.setValue(null)
  }

  getNombreFaena() {
    this.faenaService.getFaenas().subscribe({
      next: (data) => {
        console.log('Data fetched', data);
        if (data && data.resultado && Array.isArray(data.resultado)) {
          this.faenas = data.resultado.map<SelectOption<Faena>>(
            (nombreFaena) => ({
              value: nombreFaena,
              viewValue: nombreFaena.nombreFaena,
            })
          );
        } else {
          console.error('unexpected data format:', data);
          this.faenas = [];
        }
      },
      error: (error) => {
        console.error('Error fetching nombre faenas', error);
        this.faenas = [];
      },
    });
  }

  onCapture(image: string) {
    this.registeApiService.identifyPicture(image).subscribe({
      next: (res) => {
        console.log('Data fetched', res);
        this.scanFail = !!res;
        this.trabajador = res;
        if (this.trabajador == undefined) {
          Swal.fire({
            icon: 'info',
            title: 'Sin registrar',
            text: 'Trabajador no registrado',
            confirmButtonText: 'OK',
          });
          this.webcam().onCleanImage()
        }else {
          Swal.fire({
            icon: 'success',
            text: 'Trabajador Identificado',
            confirmButtonText: 'OK'
          })
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el trabajador',
          confirmButtonText: 'OK',
        });
        console.error('Error al guardar trabajador:', err);
      },
    });
  }

  getTipoRegistro() {
    this.registeApiService.getTipoRegistro().subscribe({
      next: (data) => {
        console.log('Data fetched', data);
        if (data && data.resultado && Array.isArray(data.resultado)) {
          this.tipoRegistroList = data.resultado.map<SelectOption<TipoRegistro>>(
            (tipoRegistro) => ({
              value: tipoRegistro,
              viewValue: tipoRegistro.tipoRegistro,
            })
          );
        } else {
          console.error('unexpected data format:', data);
          this.tipoRegistroList = [];
        }
      },
      error: (error) => {
        console.error('Error fetching faenas:', error);
        this.tipoRegistroList = [];
      },
    });
  }

}
