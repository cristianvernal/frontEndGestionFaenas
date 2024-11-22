import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {

}
