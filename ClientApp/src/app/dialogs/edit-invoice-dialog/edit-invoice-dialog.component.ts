import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Invoice} from '../../models/Invoice';

@Component({
  selector: 'app-edit-invoice-dialog',
  templateUrl: './edit-invoice-dialog.component.html',
  styleUrls: ['./edit-invoice-dialog.component.css']
})
export class EditInvoiceDialogComponent {

  invoice: Invoice;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Invoice) {
    this.invoice = data;
  }

  ngOnInit(): void {
  }

}
