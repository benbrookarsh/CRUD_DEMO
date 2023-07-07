import { Component } from '@angular/core';
import {Constants} from './models/Constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected readonly Constants = Constants;
}
