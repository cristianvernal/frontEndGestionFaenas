import { Component, Inject } from '@angular/core';
import { DialogWithTemplateData } from '../../interfaces/dialog-with-template-data.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-dialog-with-template',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './dialog-with-template.component.html',
  styleUrl: './dialog-with-template.component.css'
})
export class DialogWithTemplateComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogWithTemplateData) {}

}
