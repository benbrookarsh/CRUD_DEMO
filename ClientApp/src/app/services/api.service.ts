import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {EmailResponse} from '../models/EmailResponse';
import {Invoice} from '../models/Invoice';
import {Result} from '../models/Constants';

@Injectable()
export class ApiService {

  baseUrl = 'api/';

  constructor(
    private http: HttpClient
  ) {
  }

  async post<T>(url: string, body: any): Promise<T> {
    const headers = this.getHeaders();
    return await this.http.post<T>(this.baseUrl + url, JSON.stringify(body), {headers: headers, observe: 'response'})
      .toPromise()
      .catch(err => {
        throwError(err || 'Server error');
        return err;
      });
  }

  async get<T>(url: string, urlParams?: HttpParams): Promise<T> {
    const options = {headers: this.getHeaders(), params: urlParams};
    return await this.http.get<T>(this.baseUrl + url, options).toPromise();
  }

  getHeaders(): HttpHeaders { // to replace normal headers
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

  async sendEmail(email: string): Promise<EmailResponse> {
    let emailResponse = new EmailResponse();
    await this.post<HttpResponse<EmailResponse>>('Email', {email: email}).then(res => {
      emailResponse.email = res?.body?.email;
      emailResponse.receivedTime = res?.body?.receivedTime;
      emailResponse.status = res.status;
    });
    return emailResponse;
  }


  async postInvoice(invoice: Invoice): Promise<string> {
    return await this.post('Invoice', invoice);
  }

  async getInvoices(): Promise<Result<Invoice[]>> {
    return await this.get('Invoice/All');
  }
}
