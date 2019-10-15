export interface IIDClass {
  ID:string
}


export enum DataRoute {
  Inner = 'Inner',
  Inward = 'Inward',
  Outward = 'Outward',

}

export interface IDataBusMessage {
  id:string,
  route: DataRoute,
  sessionId: string;
  data: any
}
