import { Component, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RegisterApiService } from '../../services/register-api.service';
import { SelectOption } from '../../interfaces/select-option';
import { tableColumn, UiTableComponent } from '../../components/ui-table/ui-table.component';
import { Workers } from '../../interfaces/workers-dto';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EnpointsService } from '../../services/enpoints.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatProgressSpinnerModule,
    UiTableComponent
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements OnInit {
  registeApiService = inject(RegisterApiService);
  enpointService = inject(EnpointsService)
  tipoCargos: SelectOption<number>[] = [];
  tableColumns: tableColumn<Workers>[] = [];
  verificacion: Workers[] = [];
  tipoFaenas: SelectOption<number>[] = [];

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
        content: (row) => row.nombreCargo,
      },
      {
        label: 'Hora Entrada',
        def: 'horaEntrada',
        content: (row) => row.nombreCumplimiento,
      },
      {
        label: 'Hora Salida',
        def: 'horaSalida',
        content: (row) => row.nombreCumplimiento,
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

  clean() {
    this.formGroupFilter.reset();
  }

  onSelect(data: any) {
    console.log(data)
  }
}
