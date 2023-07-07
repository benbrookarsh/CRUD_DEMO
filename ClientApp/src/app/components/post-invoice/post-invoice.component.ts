import {Component, Input} from '@angular/core';
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
  _invoice = new Invoice();
  statusOptions: string[] = [];
  update = false;

  constructor(private api: ApiService) {
    this.statusOptions = Constants.getEnumValues(StatusEnum);
  }

  @Input() set invoice(invoice: Invoice) {
    if (invoice) {
      this._invoice = invoice;
      this.update = true;
    }
  }


  async postInvoice() {
    this.isLoading = true;
    let response;
    if (this.update) {
      response = await this.api.updateInvoice(this._invoice);
    } else {
      this._invoice.id = Constants.guidNull;
      response = await this.api.createInvoice(this._invoice);
    }
    console.log(response);
    this.isLoading = false;
  }


}
