import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'InvoiceStatus'
})
export class InvoiceStatusPipe implements PipeTransform {
  transform(status?: number): string {
    switch (status) {
      case 0:
        return 'paid';
      case 1:
        return 'unpaid';
        case 2:
        return 'overdue';
      default:
        return '';
    }
  }
}
