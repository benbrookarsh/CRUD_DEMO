import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Invoice} from '../models/Invoice';
import {Result} from '../models/Constants';


@Injectable()
export class ApiService {

  baseUrl = 'api/';

  constructor(
    private http: HttpClient,
  ) {
  }

  //region HTTP_BASE

  async post<T>(url: string, body: any, dontStringify = false): Promise<T> {
    return await this.http.post<T>(this.baseUrl + url, body, {headers: this.getHeaders()})
      .toPromise();
  }

  async put<T>(url: string, body?: any): Promise<T | null> {
    return await this.http.put<T>(this.baseUrl + url, JSON.stringify(body), {headers: this.getHeaders()})
      .toPromise();
  }

  async get<T>(url: string, urlParams?: HttpParams): Promise<T> {
    const options = {headers: this.getHeaders(), params: urlParams};
    return await this.http.get<T>(this.baseUrl + url, options)
      .toPromise();
  }

  async getExternal<T>(url: string): Promise<T> {
    return await this.http.get<T>(url).toPromise();
  }

  async delete<T>(url: string, body: T): Promise<void> {
    const response = await fetch(this.baseUrl + url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error('Delete request failed');
    }
  }

  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

  async createInvoice(model: Invoice): Promise<string> {
    return await this.post('Invoice/CreateAsync', model);
  }

  async getInvoice(id: string): Promise<Result<Invoice>> {
    return await this.get(`Invoice/${id}`);
  }

  async getAllInvoices(): Promise<Result<Invoice[]>> {
    return await this.get('Invoice/All');
  }

  async updateInvoice(invoice: Invoice): Promise<string> {
    return await this.put('Invoice/Update', invoice);
  }

  async deleteInvoice(invoice: Invoice): Promise<void> {
    await this.delete('Invoice', invoice);
  }
}
