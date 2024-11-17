import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [MatDividerModule, FooterComponent],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent {

}
