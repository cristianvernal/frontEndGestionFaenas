import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UiTableComponent } from "../../components/ui-table/ui-table.component";
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-personal-empresa',
  standalone: true,
  imports: [MatDividerModule, UiTableComponent, MatFormFieldModule,],
  templateUrl: './personal-empresa.component.html',
  styleUrl: './personal-empresa.component.css'
})
export class PersonalEmpresaComponent {

}
