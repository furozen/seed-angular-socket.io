import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {filter, takeUntil, takeWhile} from 'rxjs/operators';

import {environment} from '../../environments/environment';

import {createLogger, ILogger} from '../utils/Logger';
import {RequestService} from './socket/request.service';
import {ResponseService} from './socket/response.service';
import {SocketService} from './socket/socket.service';
import {IIDClass} from '../interfaces';
import {DataBusService} from './data-bus.service';

export interface IMessages {
  id: string;
  sessionId?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataTransportService implements IIDClass, OnDestroy {
  ID: string = 'DataTransportService';
  logger: ILogger = createLogger(this.ID);

  dataSubject: Subject<IMessages> = new Subject();
  ioConnection: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  dataSubject$ = this.dataSubject.asObservable().pipe(takeUntil(this.ngUnsubscribe));
  private connectedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  connectedSubject$ = this.connectedSubject.asObservable().pipe(takeUntil(this.ngUnsubscribe));
  private sessionId;

  constructor(
    private socketService: SocketService,
    private responseService: ResponseService,
    private requestService: RequestService,
    private databusService: DataBusService
  ) {

    this.databusService.outward$.subscribe(async (message) => {
      await this.waitTillConnected;
      this.logger.verbose('to raw channel:', message);

      this.socketService.send(message);
    });

  }

  get waitTillConnected(): Promise<boolean> {
    if (!this.connectedSubject.getValue()) {
      let sub = undefined;
      this.logger.debug('waiting till connect to socket');
      return new Promise<any>((resolve, reject) => {
        sub = this.connectedSubject$.pipe(filter(value => value), takeWhile(value => value)).subscribe((value) => {
          resolve(value);
        });
      }).finally(() => {
        // it need stop subscribe for hot subscribe
        sub.unsubscribe();
        return true;
      });
    }
    return Promise.resolve(true);
  }

  public initIoConnection(): Promise<boolean> {
    this.logger.verbose('initIoConnection');
    return new Promise(async (resolve, reject) => {
      if (!this.ioConnection) {
        this.logger.verbose('initIoConnection init sockets', environment.socketIo.url);
        this.socketService.initSocket(environment.socketIo.url);

        this.ioConnection = this.socketService.onMessage()
          .subscribe(async (message: any) => {
            //this.logger.log('message', message);
            this.handleMessage(message);
          });

        this.socketService.onEvent('connect')
          .subscribe(() => {
            this.logger.log('socket IO connected');
            resolve(true);
            this.connectedSubject.next(true);
          }, () => {
            this.logger.warn('socket IO connection fails');
            this.connectedSubject.next(false);
          });

        this.socketService.onEvent('disconnect')
          .subscribe(() => {
            this.logger.log('disconnected');
            this.connectedSubject.next(false);
          });


        await this.waitTillConnected;


      } else {
        reject(false);
        this.logger.error('Trying to init initialized connection');
      }
    });
  }

  async send(dataObj) {
    await this.waitTillConnected;
    const data = this.requestService.prepare(dataObj);
    this.socketService.send(data);
    this.logger.log(`send :`, dataObj);
  }

  ngOnDestroy() {
    this.logger.log('Service destroy');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }

  private handleMessage(message: any) {
    let parsedData = this.responseService.receive(message);
    this.logger.info('received:', parsedData);
    this.dataSubject.next(parsedData);
  }


}
