import { Injectable } from '@angular/core';
import {createLogger, ILogger} from '../../utils/Logger';
import {IIDClass} from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class ResponseService implements IIDClass{
  ID:string = 'ResponseService';

  constructor() { }

  //TODO unbinary it
  receive(data: any) {
    return data;
  }
}
