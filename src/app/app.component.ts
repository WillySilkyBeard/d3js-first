import { Component } from '@angular/core';
import { ConsoleService } from './d3/test.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private consoleService: ConsoleService) {}

  title = 'hitmap-app';

  onAction() {
    this.consoleService.log('-----')
  }
}
