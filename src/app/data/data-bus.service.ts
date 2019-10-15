import { Injectable } from '@angular/core';
import {DataRoute, IDataBusMessage} from '../interfaces';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {SocketService} from './socket/socket.service';


@Injectable({
  providedIn: 'root'
})
export class DataBusService {
  // Observable string sources
  private dataBus = new Subject<IDataBusMessage>();
  // Observable string streams
  dataBus$ = this.dataBus.asObservable();

  inward$ = this.dataBus$.pipe(filter(message => message.route === DataRoute.Inward));
  outward$ = this.dataBus$.pipe();
  inner$ = this.dataBus$.pipe(filter(message => message.route === DataRoute.Inner));

  constructor(private  socketService:SocketService) {
    this.dataBus$.subscribe((message) => {

    });


  }

  send(message: IDataBusMessage) {
    console.log(message);
    this.dataBus.next(message);
  }
}
