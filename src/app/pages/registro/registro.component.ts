import { CommonModule } from '@angular/common';
import { Component, inject, Inject, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatDialog, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DialogService } from '../../services/dialog.service';
import { DialogWithTemplateComponent } from '../../components/dialog-with-template/dialog-with-template.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {RegisterApiService} from '../../services/register-api.service'
import { CrearTrabajadorDTO } from '../../interfaces/crearTrabajadorDTO';

interface Hospedaje {
  value: string;
  viewValue: string;
}
interface cargo {
  value: string;
  viewValue: string;
}

interface Faenas {
  value: string;
  viewValue: string;
}

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
    MatSelectModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  colActions = viewChild.required('colActions', { read: TemplateRef });
  registeApiService = inject(RegisterApiService)

  constructor(private dialog: MatDialog, private dialogService: DialogService) {}

  formGroup: FormGroup = new FormGroup<{
    nombre: FormControl,
    apellido: FormControl,
    rut: FormControl,
    fechaNacimiento: FormControl,
    direccion: FormControl,
    fechaContratacion: FormControl,
    telefono: FormControl,
    email: FormControl
  }>({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    rut: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+-[0-9kK]{1}$')]), 
    fechaNacimiento: new FormControl('', Validators.required),
    direccion: new FormControl('', [Validators.required, Validators.minLength(5)]),
    fechaContratacion: new FormControl('', Validators.required),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9,15}$')]), 
    email: new FormControl('', [Validators.required, Validators.email]) 
  });

  private matDialogRef!: MatDialogRef<DialogWithTemplateComponent>;

  
  trabajador = {
    nombre: 'Juan',
    apellido: 'Pérez',
    rut: '12345678-9',
    fechaNacimiento: '1990-01-01',
    direccion: '123 Calle Falsa',
    fechaContratacion: new Date(),
    telefono: '123456789',
    email: 'juan.perez@example.com',
    hospedaje: '',
    cargo: '',
    faena: '',
    fotoUrl: 'img/istockphoto-1386479313-612x612.jpg',
  };
  hospedajes: Hospedaje[] = [
    {value: '1', viewValue: 'Jate'},
  ];

  faenas: Faenas[] = [
    {value: '1', viewValue: 'Faena 1'},
    {value: '2', viewValue: 'Faena 2'},
  ]; 
  cargos: cargo [] = [
    {value: '41', viewValue: 'Guardia de seguridad'},
    {value: '21', viewValue: 'informatico'},
    {value: '9', viewValue: 'Pintor'},
    
  ]



  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });
    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog with template close', res);
      this.formGroup.reset();
    });
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
      idTrabajador: 1,
  idTipoUsuario: 0,

  segundoNombre: 'segundoNombre',
  segundoApellido: 'segundoApellido',
  comuna: 'comuna',
  region: 'region',
  calleDireccion: 'calleDireccion',
  numeroDireccion: 'numeroDireccion',
  cargos: {
    id: 41,
    nombre: 'nombre',
    descripcion: 'descripcion',
  }
    };

    Swal.fire({
      title: 'Guardando trabajador...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.registeApiService.createTrabajador(crearTrabajadorDTO).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Trabajador guardado exitosamente',
          text: 'El trabajador ha sido guardado correctamente',
          confirmButtonText: 'OK',
        });
        this.formGroup.reset();
        this.matDialogRef.close();
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
}