import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Invoice} from '../../models/Invoice';
import {MatDialog} from '@angular/material/dialog';
import {EditInvoiceDialogComponent} from '../../dialogs/edit-invoice-dialog/edit-invoice-dialog.component';

@Component({
  selector: 'app-get-invoices',
  templateUrl: './get-invoices.component.html',
  styleUrls: ['./get-invoices.component.css']
})
export class GetInvoicesComponent implements OnInit {

  isLoading = true;

  constructor(public api: ApiService, private dialog: MatDialog) {
  }

  async ngOnInit() {
    await this.api.getAllInvoices();
    this.isLoading = false;
  }

  async editInvoice(invoice: Invoice) {
    this.dialog.open(EditInvoiceDialogComponent, {data: invoice}).afterClosed();
  }


  async delete(invoice: Invoice) {
    await this.api.deleteInvoice(invoice);
  }
}
