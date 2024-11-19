import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Inject,
  OnInit,
  TemplateRef,
  viewChild,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FooterComponent } from '../../components/footer/footer.component';
import {
  MatDialog,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogService } from '../../services/dialog.service';
import { DialogWithTemplateComponent } from '../../components/dialog-with-template/dialog-with-template.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RegisterApiService } from '../../services/register-api.service';
import { CrearTrabajadorDTO } from '../../interfaces/crearTrabajadorDTO';
import { SelectOption } from '../../interfaces/select-option';
import { WebcamComponent } from '../../components/webcam/webcam.component';
import { Subject } from 'rxjs';
import { EnpointsService } from '../../services/enpoints.service';
import { TransporteEndpointsService } from '../../services/transporte-endpoints.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    FooterComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatDatepickerModule,
    MatSelectModule,
    WebcamComponent,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  colActions = viewChild.required('colActions', { read: TemplateRef });
  registeApiService = inject(RegisterApiService);
  faenaService = inject(EnpointsService);
  transporteService = inject(TransporteEndpointsService);
  triggerSource = new Subject<void>();
  webcam = viewChild.required(WebcamComponent)
  scanFail = false
 

  get trigger() {
    return this.triggerSource.asObservable();
  }

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}
  ngOnInit(): void {
    this.getTipoCargo();
    this.getNombreFaena();
    this.getTransporte();
  }

  formGroup: FormGroup = new FormGroup<{
    nombre: FormControl;
    apellido: FormControl;
    rut: FormControl;
    fechaNacimiento: FormControl;
    direccion: FormControl;
    fechaContratacion: FormControl;
    cargos: FormControl;
    telefono: FormControl;
    email: FormControl;
  }>({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    rut: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+-[0-9kK]{1}$'),
    ]),
    fechaNacimiento: new FormControl('', Validators.required),
    direccion: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    fechaContratacion: new FormControl('', Validators.required),
    cargos: new FormControl(null, Validators.required),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{9,15}$'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  private matDialogRef!: MatDialogRef<DialogWithTemplateComponent>;

  trabajador: CrearTrabajadorDTO | undefined
  
  transportes: SelectOption<number>[] = [];
  faenas: SelectOption<number>[] = [];
  cargos: SelectOption<number>[] = [];

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });
    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog with template close', res);
      this.formGroup.reset();
    });
  }

  onScanWorker() {
    this.triggerSource.next();
  }

  limpiar() {
    this.webcam().onCleanImage()
    this.trabajador = undefined
  }


  onCapture(image: string) {
    
    this.registeApiService.identifyPicture(image).subscribe({
      next: (res) => {
        console.log('Data fetched', res);
        this.scanFail = !!res
        this.trabajador = res
        if(this.trabajador == undefined) {
          Swal.fire({
            icon: 'info',
            title: 'Sin registrar',
            text: 'Trabajador no registrado',
            confirmButtonText: 'OK'
          })
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo escanear usuario',
          confirmButtonText: 'OK',
        });
        console.error('Error al guardar trabajador:', err);
      },
    })
  }

  onSave() {
    if (this.formGroup.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos requeridos.',
        confirmButtonText: 'OK',
      });
      return;
    }
    const crearTrabajadorDTO: CrearTrabajadorDTO = {
      primerNombre: this.formGroup.value.nombre,
      primerApellido: this.formGroup.value.apellido,
      run: this.formGroup.value.rut,
      fechaNacimiento: this.formGroup.value.fechaNacimiento,
      direccion: this.formGroup.value.direccion,
      fechaContratacion: this.formGroup.value.fechaContratacion,
      telefono: this.formGroup.value.telefono,
      email: this.formGroup.value.email,

      idTipoUsuario: 0,

      segundoNombre: 'segundoNombre',
      segundoApellido: 'segundoApellido',
      comuna: 'comuna',
      region: 'region',
      calleDireccion: 'calleDireccion',
      numeroDireccion: 'numeroDireccion',
      cargos: {
        id: Number(this.formGroup.value.cargos),
        nombre: 'nombre',
        descripcion: 'descripcion',
      },
    };

    Swal.fire({
      title: 'Guardando trabajador...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const image = this.webcam().imageUrl.split(',')[1]
    this.registeApiService.createTrabajador(crearTrabajadorDTO, image).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Trabajador guardado exitosamente',
          text: 'El trabajador ha sido guardado correctamente',
          confirmButtonText: 'OK',
        });
        this.formGroup.reset();
        this.matDialogRef.close();
        this.trabajador = response.worker.resultado
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

  getTipoCargo() {
    this.registeApiService.getTipoCargo().subscribe({
      next: (data) => {
        console.log('Data fetched', data);
        if (data && data.resultado && Array.isArray(data.resultado)) {
          this.cargos = data.resultado.map<SelectOption<number>>(
            (tipoCargo) => ({
              value: tipoCargo.id,
              viewValue: tipoCargo.nombre,
            })
          );
        } else {
          console.error('unexpected data format:', data);
          this.cargos = [];
        }
      },
      error: (error) => {
        console.error('Error fetching faenas:', error);
        this.cargos = [];
      },
    });
  }

  getNombreFaena() {
    this.faenaService.getFaenas().subscribe({
      next: (data) => {
        console.log('Data fetched', data);
        if (data && data.resultado && Array.isArray(data.resultado)) {
          this.faenas = data.resultado.map<SelectOption<number>>(
            (nombreFaena) => ({
              value: nombreFaena.idTrabajador,
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

  getTransporte() {
    this.transporteService.getTipoTransporte().subscribe({
      next: (data) => {
        console.log('Data fetched', data);
        if (data && data.resultado && Array.isArray(data.resultado)) {
          this.transportes = data.resultado.map<SelectOption<number>>(
            (transporte) => ({
              value: transporte.idTransporte,
              viewValue: transporte.tipoTransporte,
            })
          );
        } else {
          console.error('unexpected data format:', data);
          this.transportes = [];
        }
      },
      error: (error) => {
        console.error('Error fetching nombre faenas', error);
        this.transportes = [];
      },
    });
  }
}
