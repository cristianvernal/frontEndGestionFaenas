import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Faena } from '../../interfaces/faenas';
import { AttendanceEndpointService } from '../../services/attendance-endpoint.service';
import { CrearTrabajadorDTO } from '../../interfaces/crearTrabajadorDTO';
import { MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DialogWithTemplateComponent } from '../../components/dialog-with-template/dialog-with-template.component';
import { DialogService } from '../../services/dialog.service';
import {
  tableColumn,
  UiTableComponent,
} from '../../components/ui-table/ui-table.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FooterComponent } from "../../components/footer/footer.component";
import { RegisterApiService } from '../../services/register-api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '../../interfaces/select-option';
import { Workers } from '../../interfaces/workers-dto';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-trabajadores',
  standalone: true,
  imports: [
    MatDividerModule,
    UiTableComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatTooltipModule,
    MatDialogClose,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
],
  templateUrl: './trabajadores.component.html',
  styleUrl: './trabajadores.component.css',
})
export class TrabajadoresComponent implements OnInit {
  attendanceService = inject(AttendanceEndpointService);
  registerService = inject(RegisterApiService);
  faenas: Faena[] = [];
  workerList: CrearTrabajadorDTO[] = [];
  tableWorker: tableColumn<CrearTrabajadorDTO>[] = [];
  colActions = viewChild.required('colActions', { read: TemplateRef });
  loading: boolean = false;
  tipoCargos: SelectOption<number>[] = [];
  verificacion: Workers[] = [];

  private matDialogRef!: MatDialogRef<DialogWithTemplateComponent>;

  constructor(
    private dialogService: DialogService,
    private readonly activedRoute: ActivatedRoute
  ) {}

  formGroupFilter = new FormGroup({
    tipoCumplimiento: new FormControl(),
    cargo: new FormControl(),
    rut: new FormControl(),
    faena: new FormControl(),
  });

  ngOnInit(): void {
    this.setTableDialog();
    this.onShowWorker();
    this.getTipoCargos();
  }

  setTableDialog() {
    this.tableWorker = [
      {
        label: 'Nombre',
        def: 'nombre',
        content: (row) => row.primerNombre,
      },
      {
        label: 'Apellido',
        def: 'apellido',
        content: (row) => row.primerApellido,
      },
      {
        label: 'Rut',
        def: 'run',
        content: (row) => row.run,
      },
      {
        label: 'Fecha de Nacimiento',
        def: 'fechaNacimiento',
        content: (row) => new Date(row.fechaNacimiento).toLocaleDateString('es-CL'),
      },
      {
        label: 'Fecha de Contratación',
        def: 'fechaContratacion',
        content: (row) => new Date(row.fechaContratacion).toLocaleDateString('es-CL'),
      },
      {
        label: 'Correo',
        def: 'Correo',
        content: (row) => row.email,
      },
      {
        label: 'Telefono',
        def: 'telefono',
        content: (row) => row.telefono,
      },
      {
        label: 'Cargo',
        def: 'cargo',
        content: (row) => row.cargos.nombre,
      },
      {
        label: 'Acciones',
        def: 'acciones',
        template: this.colActions(),
      },
    ];
  }

  onShowWorker() {
    const idFaena = this.activedRoute.snapshot.paramMap.get('idFaena');
    console.log('faena:', idFaena)
    this.attendanceService.getWorkerByFaenaId(Number(idFaena)).subscribe({
      next: (res) => {
        console.log('res: ', res);
        this.workerList = res;
      },
    });
  }

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });
    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog with template close', res);
    });
  }

  getTipoCargos() {
    this.registerService.getTipoCargo().subscribe({
      next: (res) => {
        this.tipoCargos = res.resultado.map((tipoCargo) => ({
          value: tipoCargo.id,
          viewValue: tipoCargo.nombre,
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
    this.registerService.getRegistroAprobados(filters).subscribe({
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

  getWorkersPhoto(rut: CrearTrabajadorDTO) {
    this.registerService.getTrabajadorByPhoto(rut.run).subscribe({
      next: (data: any) => {
        console.log('Data fetched: ', data);
        if(data && data.resultado && Array.isArray(data.resultado)) {
          this.workerList = data.resultado;
        }else {
          console.error('Unexpected data format: ', data);
          this.workerList = [];
        }
        console.log(data)
      },
      error: (error) => {
        console.error('Error fetching workerList:', error);
        this.workerList = [];
      }
    })
  }
}
