import { Component } from '@angular/core';
import {createLogger, ILogger} from './utils/Logger';
import {AppService} from './app.service';
import {IIDClass} from './Interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements IIDClass {
  readonly ID: string = 'AppComponent';
  private logger: ILogger = createLogger(this.ID);

  sessionId: string;

  constructor(
    private appService:AppService
  ) {

  }

  async ngOnInit() {
   await this.appService.handShake();
  }

}
