import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DialogCustomerData } from '../interfaces/dialog-customer-data.model';
import { DialogWithTemplateComponent } from '../components/dialog-with-template/dialog-with-template.component';
import { DialogWithTemplateData } from '../interfaces/dialog-with-template-data.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private matDialog: MatDialog) { }

  openDialogCustom(data: DialogCustomerData) {
    return this.matDialog.open(DialogComponent, {data})
  }

  openDialogWithTemplate(data: DialogWithTemplateData) {
    return this.matDialog.open(DialogWithTemplateComponent, {data, disableClose: true})
  }
}
