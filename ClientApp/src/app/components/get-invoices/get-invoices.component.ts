import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Invoice} from '../../models/Invoice';
import {MatDialog} from '@angular/material/dialog';
import {EditInvoiceDialogComponent} from '../../dialogs/edit-invoice-dialog/edit-invoice-dialog.component';
import {Constants} from '../../models/Constants';

@Component({
  selector: 'app-get-invoices',
  templateUrl: './get-invoices.component.html',
  styleUrls: ['./get-invoices.component.scss']
})
export class GetInvoicesComponent implements OnInit {

  isLoading = false;
  total: number;
  totalVat: number;
  protected readonly Constants = Constants;

  constructor(public api: ApiService, private dialog: MatDialog) {
  }

  async ngOnInit() {
    this.isLoading = true;
    await this.api.getAllInvoices();
    this.total = this.api.invoices.map(i => i.totalAmount).reduce((a, b) => a + b, 0);
    this.totalVat = this.api.invoices.map(i => i.vat).reduce((a, b) => a + b, 0);
    this.isLoading = false;
  }

  async editInvoice(invoice: Invoice) {
    this.dialog.open(EditInvoiceDialogComponent, {data: invoice}).afterClosed();
  }

  async delete(invoice: Invoice) {
    await this.api.deleteInvoice(invoice);
  }
}
