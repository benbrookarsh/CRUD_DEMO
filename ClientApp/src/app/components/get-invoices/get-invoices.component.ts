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
  total = 0;
  totalVat = 0;
  protected readonly Constants = Constants;
  message = '';

  constructor(public api: ApiService, private dialog: MatDialog) {
  }

  async ngOnInit() {
    this.isLoading = true;
    try {
      await this.api.getAllInvoices();
      this.calculateTotal();
      this.message = '';
    } catch (e) {
      this.message = 'error getting invoices';
    }
    this.isLoading = false;
  }

  calculateTotal() {
    if (this.api.invoices?.length) {
      this.total = this.api.invoices.map(i => i.totalAmount).reduce((a, b) => a + b, 0);
      this.totalVat = this.api.invoices.map(i => i.vat).reduce((a, b) => a + b, 0);
    }
  }

  async editInvoice(invoice: Invoice) {
    this.dialog.open(EditInvoiceDialogComponent, {data: invoice}).afterClosed();
    this.calculateTotal();
  }

  async delete(invoice: Invoice) {
    await this.api.deleteInvoice(invoice);
    this.calculateTotal();
  }
}
