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
    MatProgressSpinnerModule
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
}
