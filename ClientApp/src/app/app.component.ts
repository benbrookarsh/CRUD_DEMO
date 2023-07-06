import { Component } from '@angular/core';
import {ApiService} from './services/api.service';
import {EmailResponse} from './models/EmailResponse';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  response?: EmailResponse;
  isLoading =  false;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  constructor(private api: ApiService) {
  }

  async sendRequest() {
    this.isLoading = true;
    if (this.emailFormControl.valid) {
      this.response = await this.api.sendEmail(this.emailFormControl.value!);
    }
    this.isLoading = false;
  }
}
