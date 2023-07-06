import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Invoice} from '../../models/Invoice';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css']
})
export class EditInvoiceComponent {

  invoice: Invoice;
  constructor(@Inject(MAT_DIALOG_DATA) invoice: Invoice) {
    this.invoice = invoice;
    console.log('from dialog', invoice);
  }



}
