import { Injectable } from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import * as socketIo from 'socket.io-client';
import {createLogger, ILogger} from '../../utils/Logger';
import {IIDClass} from '../../Interfaces';



@Injectable({
  providedIn: 'root'
})
export class SocketService implements IIDClass{
  readonly ID:string = 'SocketService';
  private logger:ILogger = createLogger(this.ID);

  private socket;
  private sessionId;

  private observer:Subscriber<any>;

  public setSession(sessionId){
    this.sessionId = sessionId;

    const messageId = this.getMessageId();
    //this.logger.debug(` on ${messageId}`);
    this.socket.on(messageId,
      (data: any) => {
        this.observer.next(data)
      });
  }

  public initSocket(serverUrl:string): void {
    this.socket = socketIo(serverUrl);
  }

  //TODO binary!
  public send(message: any): void {
    //this.socket.binary(true).emit('message', message);
    this.socket.emit('message', message);
  }



  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.observer = observer;
      this.socket.on('message', (data: any) => {
        this.logger.log('onMessage', data);
        this.observer.next(data)
      });
    });
  }


  public onEvent(event: string): Observable<any> {
    return new Observable<string>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  private getRoomId() {
    return this.sessionId;
  }

  private getMessageId() {
    return 'message:' + this.getRoomId();
  }


}
