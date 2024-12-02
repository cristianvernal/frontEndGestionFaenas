import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import {
  tableColumn,
  UiTableComponent,
} from '../../components/ui-table/ui-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CrearTrabajadorDTO } from '../../interfaces/crearTrabajadorDTO';
import { MatIconModule } from '@angular/material/icon';
import { RegisterApiService } from '../../services/register-api.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Workers } from '../../interfaces/workers-dto';
import { DialogService } from '../../services/dialog.service';
import { MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DialogWithTemplateComponent } from '../../components/dialog-with-template/dialog-with-template.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { rutValidator } from '../../components/rut/rut-validador';
import { SelectOption } from '../../interfaces/select-option';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { validate } from 'rut.js';

@Component({
  selector: 'app-personal-empresa',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    UiTableComponent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsModule,
    MatNativeDateModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
  ],
  templateUrl: './personal-empresa.component.html',
  styleUrl: './personal-empresa.component.css',
})
export class PersonalEmpresaComponent implements OnInit {
  tableColumns: tableColumn<CrearTrabajadorDTO>[] = [];
  trabajadores: CrearTrabajadorDTO[] = [];
  colActions = viewChild.required('colActions', { read: TemplateRef });
  registerService = inject(RegisterApiService);
  loading: boolean = false;
  workerList: Workers[] = [];
  cargos: SelectOption<number>[] = [];

  formGroupFilter = new FormGroup({
    rut: new FormControl(),
  });

  formGroup: FormGroup = new FormGroup<{
    idTrabajador: FormControl;
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
    idTrabajador: new FormControl(null),
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    rut: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+-[0-9kK]{1}$'),
      rutValidator,
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

  constructor(
    private readonly activedRoute: ActivatedRoute,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.setTableColumns();
    this.getTrabajadores();
    this.getTipoCargo();
  }

  setTableColumns() {
    this.tableColumns = [
      {
        label: 'Nombre',
        def: 'primerNombre',
        content: (row) => row.primerNombre,
      },
      {
        label: 'Apellido',
        def: 'primerApellido',
        content: (row) => row.primerApellido,
      },
      {
        label: 'Rut',
        def: 'run',
        content: (row) => row.run,
      },
      {
        label: 'Cargo',
        def: 'nombreCargo',
        content: (row) => row.cargos.nombre,
      },
      {
        label: 'Fecha de Nacimiento',
        def: 'fechaNacimiento',
        content: (row) => row.fechaNacimiento,
      },
      {
        label: 'Fecha de Contratación',
        def: 'fechaContratacion',
        content: (row) => row.fechaContratacion,
      },
      {
        label: 'Correo',
        def: 'horaSalida',
        content: (row) => row.email,
      },
      {
        label: 'Dirección',
        def: 'direccion',
        content: (row) => row.direccion,
      },
      {
        label: 'Telefono',
        def: 'telefono',
        content: (row) => row.telefono,
      },
      {
        label: 'Acciones',
        def: 'acciones',
        template: this.colActions(),
      },
    ];
  }

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });
  }

  getTrabajadores() {
    this.loading = true;
    this.registerService.getTrabajadores().subscribe({
      next: (data: any) => {
        console.log('Data fetched: ', data);
        if (data && data.resultado && Array.isArray(data.resultado)) {
          this.trabajadores = data.resultado;
        } else {
          console.error('Unexpected data format; ', data);
          this.trabajadores = [];
        }
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching trabajadores: ', error);
        this.trabajadores = [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getTipoCargo() {
    this.registerService.getTipoCargo().subscribe({
      next: (data) => {
        console.log('Tipo cargo Fetched: ', data);
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

  onEditTrabajador(trabajador: CrearTrabajadorDTO, template: TemplateRef<any>) {
    this.formGroup.reset({
      idTrabajador: trabajador.idTrabajador,
      nombre: trabajador.primerNombre,
      apellido: trabajador.primerApellido,
      rut: trabajador.run,
      cargos: trabajador.cargos.id,
      fechaNacimiento: trabajador.fechaNacimiento,
      fechaContratacion: trabajador.fechaContratacion,
      email: trabajador.email,
      direccion: trabajador.direccion,
      telefono: trabajador.telefono,
    });
    this.openDialogWithTemplate(template);
    this.matDialogRef.afterClosed().subscribe(() => {
      this.formGroup.reset();
    });
  }

  onSaveWorker( ) {
    if(this.formGroup.invalid) {
      return
    }
    const editTrabajadorDTO: CrearTrabajadorDTO = {
      idTrabajador: this.formGroup.value.idTrabajador,
      idTipoUsuario: 0,
      primerNombre: this.formGroup.value.nombre,
      primerApellido: this.formGroup.value.apellido,
      run: this.formGroup.value.rut,
      fechaNacimiento: this.formGroup.value.fechaNacimiento,
      fechaContratacion: this.formGroup.value.fechaContratacion,
      direccion: this.formGroup.value.direccion,
      telefono: this.formGroup.value.telefono,
      email: this.formGroup.value.email,
      segundoNombre: '',
      segundoApellido: '',
      comuna: '',
      region: '',
      calleDireccion: '',
      numeroDireccion: '',
      cargos: {
        id: Number(this.formGroup.value.cargos),
        nombre: '',
        descripcion: '',
      },
    };
    Swal.fire({
      title: 'Editando trabajador...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    
    this.registerService.updateTrabajadores(editTrabajadorDTO).subscribe({
      next: (data) => {
        console.log('fetching workers data: ', data)
        Swal.fire({
          icon: 'success',
          title: 'Trabajador Editado',
          text: 'El trabajador a sido editado correctamente.',
          confirmButtonText: 'OK',
        });
        this.getTrabajadores();
      }
    })
  }

  onDeleteTrabajador(trabajador: CrearTrabajadorDTO) {
    Swal.fire({
      title: '¿Está seguro de eliminar el trabajador?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.registerService.deleteTrabajadores(trabajador).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Trabajador Eliminado',
              text: 'El trabajador a sido eliminado correctamente.',
              confirmButtonText: 'OK',
            });
            this.trabajadores = this.trabajadores.filter(
              (currentTrabajador) =>
                currentTrabajador.idTrabajador !== trabajador.idTrabajador
            );
          },
          error: (err) => {
            console.error('Error eliminando Trabajador: ', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrio un problema al eliminar el trabajador',
              confirmButtonText: 'OK',
            });
          },
        });
      }
    });
  }

  onSearch() {
    this.loading = true;
    this.registerService
      .getTrabajadorRut(this.formGroupFilter.value.rut)
      .subscribe({
        next: (res) => {
          console.log('respuesta:', res);
          this.trabajadores = [res];
        },
        error: (err) => {
          console.log('Error: ', err);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  clean() {
    this.formGroupFilter.reset();
    this.getTrabajadores();
  }

  onSelect(data: any) {
    console.log(data);
  }
}
