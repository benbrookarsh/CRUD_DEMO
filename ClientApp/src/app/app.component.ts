import { Component } from '@angular/core';
import {ApiService} from './services/api.service';
import {Invoice} from './models/Invoice';
import {StatusEnum} from './models/StatusEnum';
import {Constants} from './models/Constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

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
