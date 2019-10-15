import { Injectable } from '@angular/core';
import {AppModel} from './AppModel';
import {DataBusService} from './data/data-bus.service';
import {DataTransportService} from './data/data-transport.service';
import {SocketService} from './data/socket/socket.service';
import uuid from 'uuid/v4';
import {DataRoute, IDataBusMessage, IIDClass} from './Interfaces';
import {createLogger, ILogger} from './utils/Logger';

@Injectable({
  providedIn: 'root'
})
export class AppService implements IIDClass{
  readonly ID: string = 'AppService';
  private logger: ILogger = createLogger(this.ID);

  constructor(private dataBusService: DataBusService,
              private dataTransportService: DataTransportService,
              private socketService: SocketService) {
    this.initSession();
  }

  private initSession(){
    AppModel.sessionId = uuid();
  }

  getSessionId():string{
    return AppModel.sessionId;
  }

  async handShake() {
    await this.dataTransportService.initIoConnection();
    this.logger.log('Send Handshake');
    const message: IDataBusMessage = {
      id:"Handshake",
      route:DataRoute.Outward,
      sessionId:AppModel.sessionId,
      data:{}
    };
    this.dataBusService.send(message);
    this.socketService.setSession(AppModel.sessionId);
  }
}
