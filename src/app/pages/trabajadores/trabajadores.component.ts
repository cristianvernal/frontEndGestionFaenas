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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectOption } from '../../interfaces/select-option';
import { Workers } from '../../interfaces/workers-dto';
import { MatInputModule } from '@angular/material/input';
import { TransporteEndpointsService } from '../../services/transporte-endpoints.service';
import { HabitacionesDTO } from '../../interfaces/habitaciones-dto';
import { HotelDTO } from '../../interfaces/hotel-dto';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs';

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
    MatDialogContent,
    MatDialogTitle
],
  templateUrl: './trabajadores.component.html',
  styleUrl: './trabajadores.component.css',
})
export class TrabajadoresComponent implements OnInit {
  attendanceService = inject(AttendanceEndpointService);
  registerService = inject(RegisterApiService);
  transporteService = inject(TransporteEndpointsService);
  faenas: Faena[] = [];
  workerList: Workers[] = [];
  tableWorker: tableColumn<Workers>[] = [];
  colActions = viewChild.required('colActions', { read: TemplateRef });
  loading: boolean = false;
  tipoCargos: SelectOption<number>[] = [];
  transportes: SelectOption<string>[] = [];
  hoteles: SelectOption<HotelDTO>[] = [];
  habitaciones: SelectOption<HabitacionesDTO>[] = [];
  currentWorker: Workers | undefined;
  selectedHotel: number | null = null;

  

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

  formGroupLogistic: FormGroup = new FormGroup<{
    transporte: FormControl,
    hotel: FormControl,
    habitacion: FormControl,
  }>({
    transporte: new FormControl(null, Validators.required),
    hotel: new FormControl(null, Validators.required),
    habitacion: new FormControl(null, Validators.required),
  })



  ngOnInit(): void {
    this.setTableDialog();
    this.getTipoCargos();
    this.onSearch();
    this.getTransporte();
    this.getHotels();
    this.onListeningHotel();
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
        label: 'Correo',
        def: 'Correo',
        content: (row) => row.email,
      },
      {
        label: 'Cargo',
        def: 'cargo',
        content: (row) => row.nombreCargo
      },
      {
        label: 'Transporte',
        def: 'transporte',
        content: (row) => row.transporte
      },
      {
        label: 'Hotel',
        def: 'hotel',
        content: (row) => row.hotel
      },
      {
        label: 'Habitacion',
        def: 'habitacion',
        content: (row) => row.habitacion.toString()
      },
      {
        label: 'Acciones',
        def: 'acciones',
        template: this.colActions(),
      },
    ];
  }



  openWorker(template: TemplateRef<any>, row: Workers) {
    this.currentWorker = row
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });
    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog with template close', res);
    });
  }

  openLogistic(template: TemplateRef<any>, row: Workers){
    this.currentWorker = row
    console.log('current worker: ', this.currentWorker)
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });
    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog with template close', res);
    });
  }

  getTransporte() {
    this.transporteService.getTipoTransporte().subscribe({
      next: (data) => {
        console.log('Data fetched', data);
        if (data && data.resultado && Array.isArray(data.resultado)) {
          this.transportes = data.resultado.map<SelectOption<string>>(
            (transporte) => ({
              value: transporte.tipoTransporte,
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

  getHotels() {
    this.transporteService.getHotel().subscribe({
      next:(data) => {
        console.log('Hotel fetched: ', data);
        if(data && data.resultado && Array.isArray(data.resultado)) {
          this.hoteles = data.resultado.map<SelectOption<HotelDTO>>(
            (hotel) => ({
              value: hotel,
              viewValue: hotel.nombreHotel,
            })
          );
        } else {
          console.error('Unexpecte data format: ', data);
          this.hoteles = [];
        }
      },
      error: (error) => {
        console.error('Error fetching hoteles: ', error);
        this.hoteles = [];
      }
    })
  }

  getHabitacionByHotel(idHotel: number) {
    this.transporteService.getHabitaciones(idHotel).subscribe({
      next: (data) => {
        console.log('Habitacion fetched: ', data);
        if(data && data.resultado && Array.isArray(data.resultado)) {
          this.habitaciones = data.resultado.filter(habitacion => habitacion.estado.idEstado == 1).map<SelectOption<HabitacionesDTO>>(
            (habitacion) => ({
              value: habitacion,
              viewValue: habitacion.numeroHabitacion.toString(),
            })
          )
        }
      }
    })
  }

  onListeningHotel() {
    this.formGroupLogistic.get('hotel')?.valueChanges.subscribe(hotel => {
      if(hotel !== null) {
        this.getHabitacionByHotel(hotel.idHotel)
      }
    })
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
    const idFaena = this.activedRoute.snapshot.paramMap.get('idFaena')
    this.loading = true;
    const filters: any = {};
    Object.entries(this.formGroupFilter.value).forEach((filter) => {
      if (filter[1] !== null) {
        filters[filter[0]] = filter[1];
      }
    });
    console.log('filtros: ', filters);
    filters['faena'] = idFaena
    this.registerService.getRegistroAprobados(filters).subscribe({
      next: (res) => {
        console.log('respuesta:', res);
        this.workerList = res;
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
    this.onSearch(); 
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

  onSave() {
    const logistic = this.formGroupLogistic.value
    logistic['idFaena'] = this.currentWorker?.idFaena
    logistic['runTrabajador'] = this.currentWorker?.run
    logistic['hotel'] = this.formGroupLogistic.get('hotel')?.value.nombreHotel
    logistic['habitacion'] = this.formGroupLogistic.get('habitacion')?.value.numeroHabitacion
    this.transporteService.getLogistic(logistic).pipe(
      switchMap(res => {
        return this.transporteService.updateRoomState( this.formGroupLogistic.get('habitacion')?.value.idHabitacion, 2)
      })
    ).subscribe({
      next: (data: any) => {
        console.log('Data logistic fetched: ', data)
        Swal.fire({
          icon: 'success',
          title: 'Logisitca guardada exitosamente',
          text: 'La logistica ha sido guardado correctamente',
          confirmButtonText: 'OK',
        });
        this.onSearch();
        this.matDialogRef.close();
        this.formGroupLogistic.reset();
      }
    })
  }

  onSelect(data: any) {
    console.log(data)
  }

  onClose() {
    this.formGroupLogistic.reset()
    this.matDialogRef.close()
  }
}
