import { Component, OnInit } from '@angular/core';
import {
  tableColumn,
  UiTableComponent,
} from '../../components/ui-table/ui-table.component';
import { timer } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

interface Customer {
  nombre: string;
  apellido: string;
  email: string;
  nombreCargo: string;
  nombreCumplimineto: string;
  nombreFaena: string;
}

interface Food {
  value: string;
  viewValue: string;
}

interface Estado {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [
    UiTableComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatPaginatorModule
  ],
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.css',
})
export class VerificacionComponent implements OnInit {
  verificacion: Customer[] = [];
  tableColumns: tableColumn<Customer>[] = [];


  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Mensaje 1' },
    { value: 'pizza-1', viewValue: 'Mensaje 2' },
    { value: 'tacos-2', viewValue: 'Mensaje 3' },
  ];

  estados: Estado[] = [
    { value: 'disponible-0,', viewValue: 'Disponible' },
    { value: 'no disponible-1,', viewValue: 'No Disponible' },
  ];


  ngOnInit(): void {
    this.getCustomers();
    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      {
        label: 'Faena',
        def: 'nombreFaena',
        content: (row) => row.nombreFaena
      },
      {
        label: 'Nombre',
        def: 'Nombre',
        content: (row) => row.nombre,
      },
      {
        label: 'Apellido',
        def: 'Apellido',
        content: (row) => row.apellido,
        isSortable: true,
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
        content: (row) => row.nombreCumplimineto,
      },
    ];
  }

  getCustomers() {
    timer(100).subscribe(() => {
      this.verificacion = [
        {
          nombreFaena:'Enero',
          nombre: 'Cristian',
          apellido: 'Vernal',
          email: '18782428-4',
          nombreCargo: '34',
          nombreCumplimineto: 'Soldador',
          
        },
        {
          nombreFaena:'Enero',
          nombre: 'Leonel',
          apellido: 'Aranda',
          email: '18782428-4',
          nombreCargo: '34',
          nombreCumplimineto: 'Soldador',
          
        },
        {
          nombreFaena:'Enero',
          nombre: 'Leonel',
          apellido: 'Aranda',
          email: '18782428-4',
          nombreCargo: '34',
          nombreCumplimineto: 'Soldador',
          
        },
        {
          nombreFaena:'Enero',
          nombre: 'Leonel',
          apellido: 'Aranda',
          email: '18782428-4',
          nombreCargo: '34',
          nombreCumplimineto: 'Soldador',
          
        },
      ];
    });
  }
}
