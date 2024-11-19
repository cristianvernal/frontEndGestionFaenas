import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  viewChild,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  tableColumn,
  UiTableComponent,
} from '../../components/ui-table/ui-table.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { EnpointsService } from '../../services/enpoints.service';
import { Faena } from '../../interfaces/faenas';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '../../services/dialog.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogWithTemplateComponent } from '../../components/dialog-with-template/dialog-with-template.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FaenaDto } from '../../interfaces/faena-dto';
import { TipoFaena } from '../../interfaces/tipoFaena';
import { SelectOption } from '../../interfaces/select-option';
import { CrearFaenas } from '../../interfaces/Crearfaenass';
import { CrearTrabajadorDTO } from '../../interfaces/crearTrabajadorDTO';
import { EditFaenaDto } from '../../interfaces/faena-edit-dto';

@Component({
  selector: 'app-gestion',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    UiTableComponent,
    FooterComponent,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.css',
})
export class GestionComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private faenasService: EnpointsService,
    private dialogService: DialogService
  ) {}

  tipoFaenas: SelectOption<number>[] = [];
  faenas: Faena[] = [];
  tableColumns: tableColumn<Faena>[] = [];
  tableWorker: tableColumn<CrearTrabajadorDTO>[] = []
  loading: boolean = false;
  colActions = viewChild.required('colActions', { read: TemplateRef });
  titleEditAndCreateDialog = ''


  formGroup: FormGroup = new FormGroup({
    tipoFaenas: new FormControl(null, Validators.required),
    fechaInicio: new FormControl('', Validators.required),
    fechaTermino: new FormControl('', Validators.required),
    encargado: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    idFaena: new FormControl<number | null>(null)
  });

  private matDialogRef!: MatDialogRef<DialogWithTemplateComponent>;

  ngOnInit(): void {
    this.setTableColumns();
    this.getFaenas();
    this.getTipoFaena();
    this.setTableDialog();
  }

  setTableColumns() {
    this.tableColumns = [
      {
        label: 'Nombre Faena',
        def: 'tipoFaena.nombreFaena',
        content: (row) => row.nombreFaena,
        
      },
      {
        label: 'Fecha de inicio',
        def: 'fechaInicio',
        content: (row) => new Date(row.fechaInicio).toLocaleDateString('es-CL'),
        isSortable: true,
      },
      {
        label: 'Fecha de Término',
        def: 'fechaTermino',
        content: (row) => new Date(row.fechaTermino).toLocaleDateString(
          'es-CL'
        ),
      },
      {
        label: 'Encargado',
        def: 'encargado',
        content: (row) => row.encargado,
      },
      {
        label: 'Acciones',
        def: 'acciones',
        template: this.colActions(),
      },
    ];
  }

  setTableDialog() {
    this.tableWorker = [
      {
        label:'Nombre',
        def: 'nombre',
        content: (row) => row.primerNombre
      },
      {
        label:'Apellido',
        def: 'apellido',
        content: (row) => row.primerApellido
      },
      {
        label:'Rut',
        def: 'eun',
        content: (row) => row.run
      },
      {
        label:'Cargo',
        def: 'cargo',
        content: (row) => row.cargos.nombre
      },
    ]
  }

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });   
  }

  onCreateFaena(template: TemplateRef<any>) {
    this.titleEditAndCreateDialog = 'Crear Faena'
    this.openDialogWithTemplate(template)
    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog with template close', res);
      this.formGroup.reset();
    });
  }

  getFaenas() {
    this.loading = true;
    this.faenasService.getFaenas().subscribe({
      next: (data: any) => {
        console.log('Data fetched:', data);
        if (data && data.resultado && Array.isArray(data.resultado)) {
          this.faenas = data.resultado
        } else {
          console.error('Unexpected data format:', data);
          this.faenas = [];
        }
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching faenas:', error);
        this.faenas = [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getTipoFaena() {
    this.faenasService.getTipoFaena().subscribe({
      next: (data) => {
        console.log('Data fetched', data);
        if(data && data.resultado && Array.isArray(data.resultado)) {
          this.tipoFaenas = data.resultado.map<SelectOption<number>>(tipoFaena => ({
            value: tipoFaena.idTipoFaena,
            viewValue: tipoFaena.nombreFaena,
          }))
        }else {
          console.error('unexpected data format:', data);
          this.tipoFaenas = [];
        }
      },
      error: (error) => {
        console.error('Error fetching faenas:', error);
        this.tipoFaenas = [];
      },
    })
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
    const faenaDataDto: FaenaDto = {
      idTipoFaena: Number(this.formGroup.value.tipoFaenas),
      idTrabajador: 1,
      fechaInicio: this.formGroup.value.fechaInicio,
      fechaTermino: this.formGroup.value.fechaTermino,
      encargado: this.formGroup.value.encargado,
    };

    Swal.fire({
      title: 'Guardando faena...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    if(this.formGroup.get('idFaena')?.value !== null) {
        const editFaena: EditFaenaDto = {
          idFaena: this.formGroup.get('idFaena')?.value,
          nombreFaena: this.formGroup.get('nombreFaena')?.value,
          idTrabajador: 1,
          fechaInicio: this.formGroup.get('fechaInicio')?.value,
          fechaTermino: this.formGroup.get('fechaTermino')?.value,
          encargado: this.formGroup.get('encargado')?.value,
          idTipoFaena: this.formGroup.get('idTipoFaena')?.value
  
        } 
        this.faenasService.updateFaena(editFaena).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Faena guardada exitosamente',
              text: 'La faena ha sido guardada correctamente',
              confirmButtonText: 'OK',
            });
            this.formGroup.reset();
            this.getFaenas();
            this.matDialogRef.close();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo guardar la faena',
              confirmButtonText: 'OK',
            });
            console.error('Error al guardar la faena:', err);
          },
        })
    }else {
      this.faenasService.createFaena(faenaDataDto).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Faena guardada exitosamente',
            text: 'La faena ha sido guardada correctamente',
            confirmButtonText: 'OK',
          });
          this.formGroup.reset();
          this.getFaenas();
          this.matDialogRef.close();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar la faena',
            confirmButtonText: 'OK',
          });
          console.error('Error al guardar la faena:', err);
        },
      });
    }
  }

  onEditFaenas(faena: Faena, template: TemplateRef<any>) {
    this.titleEditAndCreateDialog = 'Editar Faena'
    this.formGroup.reset({
      tipoFaenas: faena.idTipoFaena,
      fechaInicio: faena.fechaInicio,
      fechaTermino: faena.fechaTermino,
      encargado: faena.encargado,
      idFaena: faena.idFaena
    })
    this.openDialogWithTemplate(template)
    this.matDialogRef.afterClosed().subscribe(() => {
      this.formGroup.reset()
    }) 
    
  }

  

  onDeleteFaena(faena: Faena) {
    Swal.fire({
      title: '¿Está seguro de eliminar la faena?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.faenasService.deleteFaena(faena).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Faena eliminada',
              text: 'La faena ha sido eliminada correctamente.',
              confirmButtonText: 'OK',
            })
            this.faenas = this.faenas.filter(currentFaena => currentFaena.idFaena !== faena.idFaena) 
          },
          error: (err) => {
            console.error('Error eliminando la faena:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema al eliminar la faena.',
              confirmButtonText: 'OK',
            });
          }
        });
      }
    });
  }
}
