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
import { MatDialogRef } from '@angular/material/dialog';
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
],
  templateUrl: './trabajadores.component.html',
  styleUrl: './trabajadores.component.css',
})
export class TrabajadoresComponent implements OnInit {
  attendanceService = inject(AttendanceEndpointService);
  faenas: Faena[] = [];
  workerList: CrearTrabajadorDTO[] = [];
  tableWorker: tableColumn<CrearTrabajadorDTO>[] = [];
  colActions = viewChild.required('colActions', { read: TemplateRef });
  loading: boolean = false;

  private matDialogRef!: MatDialogRef<DialogWithTemplateComponent>;

  constructor(
    private dialogService: DialogService,
    private readonly activedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setTableDialog();
    this.onShowWorker();
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
    this.loading = true;
    const idFaena = this.activedRoute.snapshot.paramMap.get('idFaena');
    console.log('faena:', idFaena)
    this.attendanceService.getWorkerByFaenaId(Number(idFaena)).subscribe({
      next: (res) => {
        console.log('res: ', res);
        this.workerList = res;
      },
      complete: () => {
        this.loading = false;
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
}
