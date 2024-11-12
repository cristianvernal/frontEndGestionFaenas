import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-dialog-registro',
  standalone: true,
  imports: [ CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,],
  templateUrl: './dialog-registro.component.html',
  styleUrl: './dialog-registro.component.css'
})
export class DialogRegistroComponent {

  @Output() confirmed = new EventEmitter<{
    nombre: string;
    apellido: string;
    rut: string;
    edad: number | null;
    direccion: string;
    fechaContratacion: Date | null;
    telefono: string;
    email: string;
  }>();

  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  edad: number | null = null;
  direccion: string = '';
  fechaContratacion: Date | null = null;
  telefono: string = '';
  email: string = '';

  constructor(private dialogRef: MatDialogRef<DialogRegistroComponent>) {}

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.confirmed.emit({
      nombre: this.nombre,
      apellido: this.apellido,
      rut: this.rut,
      edad: this.edad,
      direccion: this.direccion,
      fechaContratacion: this.fechaContratacion,
      telefono: this.telefono,
      email: this.email,
    });
    this.close();
  }

}
