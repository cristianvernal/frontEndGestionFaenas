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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { AttendanceTableDTO } from '../../interfaces/attendance-table';
import { ShiftsService } from '../../services/shifts.service';
import { AttendanceByDay } from '../../interfaces/attendance-by-day';
import { AsistenciaResponse } from '../../interfaces/asistencia-response';
import { filter } from 'rxjs';



@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    UiTableComponent,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements OnInit {
  registeApiService = inject(RegisterApiService);
  shiftService = inject(ShiftsService);
  enpointService = inject(EnpointsService)
  tipoCargos: SelectOption<number>[] = [];
  tableColumns: tableColumn<AsistenciaResponse>[] = [];
  asistencia: AsistenciaResponse[] = [];
  attendace: AttendanceTableDTO[] = [];
  tipoFaenas: SelectOption<number>[] = [];
  loading: boolean = false;
  verificacion: AttendanceByDay[] = []
  

  formGroupFilter = new FormGroup({
    rut:  new FormControl(),
    faena: new FormControl(),
    fecha: new FormControl(),
  })

  formGroupFilter2 = new FormGroup({
    run:  new FormControl(),
    faena: new FormControl(),
    fecha: new FormControl(),
    cargo: new FormControl(),
  })

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
        content: (row) => row.nombreCompleto,
      },
      {
        label: 'Apellido',
        def: 'primerApellido',
        content: (row) => row.runTrabajador,
      },
      {
        label: 'Rut',
        def: 'run',
        content: (row) => row.cargo,
      },
      {
        label: 'Hora Entrada',
        def: 'horaEntrada',
        content: (row) => row.horaEntrada,
      },
      {
        label: 'Hora Salida',
        def: 'horaSalida',
        content: (row) => row.horaSalida,
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

  searchAttendance() {
    this.loading = true;
    const termsSearch = this.formGroupFilter.value
    this.registeApiService.getAsistencia(termsSearch).subscribe({
      next: (data) => {
        console.log("Fetching attendace: ", data);
        this.attendace = data
      },
      complete: () => {
        this.loading = false;
      },
    })
  }

  onSearch() {
    this.loading = true;
    const filters: any = {}
    Object.entries(this.formGroupFilter2.value).forEach((filter) => {
      if (filter[1] !== null) {
        filters[filter[0]] = filter[1];
      }
    });
    console.log('filtros: ', filters);
    // const attendanceSearch = this.formGroupFilter2.value
    this.shiftService.attendanceByDay(filters).subscribe({
      next: (data) => {
        console.log('Respuesta de la API:', data);
        this.asistencia = data
      },
      error: (err) => {
        console.error('Error al obtener los datos:', err);
        this.asistencia = []; 
      },
      complete: () => {
        this.loading = false; 
      }
    });
  }

  clean() {
    this.formGroupFilter2.reset();
  }

  onSelect(data: any) {
    console.log(data)
  }



}
