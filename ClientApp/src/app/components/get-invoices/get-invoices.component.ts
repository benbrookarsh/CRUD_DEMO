import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Invoice} from '../../models/Invoice';
import {MatDialog} from '@angular/material/dialog';
import {EditInvoiceComponent} from '../../dialogs/edit-invoice/edit-invoice.component';

@Component({
  selector: 'app-get-invoices',
  templateUrl: './get-invoices.component.html',
  styleUrls: ['./get-invoices.component.css']
})
export class GetInvoicesComponent implements OnInit {


  isLoading = true;
  invoices: Invoice[] = [];

  constructor(private api: ApiService, private dialog: MatDialog) {
  }

  async ngOnInit() {
    const res = await this.api.getInvoices();
    this.invoices = res.value;
    this.isLoading = false;
  }

  async editInvoice(i: Invoice) {
    await this.dialog.open(EditInvoiceComponent, i).afterClosed();
  }
}
