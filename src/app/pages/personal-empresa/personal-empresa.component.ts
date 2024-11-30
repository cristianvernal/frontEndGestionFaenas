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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Workers } from '../../interfaces/workers-dto';

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
    ReactiveFormsModule
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

  formGroupFilter = new FormGroup({
    rut: new FormControl(),
  });

  constructor(private readonly activedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.setTableColumns();
    this.getTrabajadores();
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

  onDeleteTrabajador(trabajador: CrearTrabajadorDTO) {
    Swal.fire({
      title: '¿Está seguro de eliminar la faena?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if(result.isConfirmed) {
        this.registerService.deleteTrabajadores(trabajador).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Trabajador Eliminado',
              text: 'El trabajador a sido eliminado correctamente.',
              confirmButtonText: 'OK',
            });
            this.trabajadores = this.trabajadores.filter((currentTrabajador) => currentTrabajador.idTrabajador !== trabajador.idTrabajador);
          },
          error: (err) => {
            console.error('Error eliminando Trabajador: ', err)
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrio un problema al eliminar el trabajador',
              confirmButtonText: 'OK',
            })
          }
        })
      }
    })
  }

  onSearch() {
    
    this.loading = true;
    this.registerService.getTrabajadorRut(this.formGroupFilter.value.rut).subscribe({
      next: (res) => {
        console.log('respuesta:', res);
         this.trabajadores = [res];
      },
      error: (err) => {
        console.log('Error: ', err);
      },
      complete: () => {
        this.loading = false
      }
    });
  }

  clean() {
    this.formGroupFilter.reset();
  }

  onSelect(data: any) {
    console.log(data)
  }
}
