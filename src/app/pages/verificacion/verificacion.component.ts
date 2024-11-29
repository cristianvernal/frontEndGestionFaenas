import { Component, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import {
  tableColumn,
  UiTableComponent,
} from '../../components/ui-table/ui-table.component';
import { timer } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SelectOption } from '../../interfaces/select-option';
import { RegisterApiService } from '../../services/register-api.service';
import { RegistroDTO } from '../../interfaces/registro-dto';
import { EnpointsService } from '../../services/enpoints.service';
import { Workers } from '../../interfaces/workers-dto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [
    CommonModule,
    UiTableComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.css',
})
export class VerificacionComponent implements OnInit {
  registeApiService = inject(RegisterApiService);
  enpointService = inject(EnpointsService);
  verificacion: Workers[] = [];
  tableColumns: tableColumn<Workers>[] = [];
  tipoCumplimientos: SelectOption<number>[] = [];
  tipoCargos: SelectOption<number>[] = [];
  tipoFaenas: SelectOption<number>[] = [];
  loading: boolean = false;
  colActions = viewChild.required('colActions', { read: TemplateRef });
  

  formGroupFilter = new FormGroup({
    tipoCumplimiento: new FormControl(),
    cargo: new FormControl(),
    rut: new FormControl(),
    faena: new FormControl(), 
  });

  ngOnInit(): void {
    this.setTableColumns();
    this.getTipoCargos();
    this.getTipoFaena();
    this.getTipoCumplimiento();
  }

  setTableColumns() {
    this.tableColumns = [
      {
        label: 'Faena',
        def: 'nombreFaena',
        content: (row) => row.nombreFaena,
      },
      {
        label: 'Nombre',
        def: 'Nombre',
        content: (row) => row.primerNombre,
      },
      {
        label: 'Apellido',
        def: 'Apellido',
        content: (row) => row.primerApellido,
        isSortable: true,
      },
      {
        label: 'Rut',
        def: 'run',
        content: (row) => row.run,
      },
      {
        label: 'Email',
        def: 'email',
        content: (row) => row.email,
      },
      {
        label: 'Nombre Cargo',
        def: 'nombreCargo',
        content: (row) => row.nombreCargo,
      },
      {
        label: 'Estado',
        def: 'nombreCumplimiento',
        content: (row) => row.nombreCumplimiento,
      },
      {
        label: 'Acciones',
        def: 'acciones',
        template: this.colActions(),
      },
    ];
  }

  getTipoCargos() {
    this.registeApiService.getTipoCargo().subscribe({
      next: (res) => {
        this.tipoCargos = res.resultado.map((tipoCargo) => ({
          value: tipoCargo.id,
          viewValue: tipoCargo.nombre,
        }));
      },
    });
  }

  getTipoFaena() {
    this.enpointService.getFaenas().subscribe({
      next: (res) => {
        this.tipoFaenas = res.resultado.map((tipoFaena) => ({
          value: tipoFaena.idFaena,
          viewValue: tipoFaena.nombreFaena,
        }));
      },
    });
  }

  getTipoCumplimiento() {
    this.registeApiService.getCumplimiento().subscribe({
      next: (res) => {
        this.tipoCumplimientos = res.resultado.map((tipoCumplimiento) => ({
          value: tipoCumplimiento.tipoCumplimiento,
          viewValue: tipoCumplimiento.nombreCumplimiento,
        }));
      },
    });
  }

  onSearch() {
    this.loading = true;
    const filters: any = {};
    Object.entries(this.formGroupFilter.value).forEach((filter) => {
      if (filter[1] !== null) {
        filters[filter[0]] = filter[1];
      }
    });
    console.log('filtros: ', filters);
    this.registeApiService.getRegistro(filters).subscribe({
      next: (res) => {
        console.log('respuesta:', res);
        this.verificacion = res;
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
