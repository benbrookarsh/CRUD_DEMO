import { Component } from '@angular/core';
import {Invoice} from '../../models/Invoice';
import {ApiService} from '../../services/api.service';
import {StatusEnum} from '../../models/StatusEnum';
import {Constants} from '../../models/Constants';

@Component({
  selector: 'app-post-invoice',
  templateUrl: './post-invoice.component.html',
  styleUrls: ['./post-invoice.component.css']
})
export class PostInvoiceComponent {

  isLoading =  false;

  invoice = new Invoice();
  statusOptions: string[] = [];
  constructor(private api: ApiService) {
    this.statusOptions = this.getEnumValues(StatusEnum);
  }

  getEnumValues(enumObject: any): string[] {
    return Object.keys(enumObject)
      .filter(key => isNaN(Number(enumObject[key])))
      .map(key => enumObject[key]);
  }

  async postInvoice() {
    this.isLoading = true;
    console.log(this.invoice);
    const invoice = {
      id: Constants.guidNull,
      invoiceNumber: '123',
      date: this.invoice.date,
      status: 0
    };
    const response = await this.api.createInvoice(invoice);
    console.log(response);
    this.isLoading = false;
  }

}
