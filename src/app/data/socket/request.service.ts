import { Injectable } from '@angular/core';

import {createLogger, ILogger} from '../../utils/Logger';
import {IIDClass} from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class RequestService implements IIDClass{
  ID:string = 'RequestService';
  logger:ILogger = createLogger(this.ID);
  constructor() { }
  //TODO binary it
  prepare(dataObj: any):any {
    const request = dataObj;
    return request;
  }
}
