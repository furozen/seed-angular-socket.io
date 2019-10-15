export interface IEnviroment {
  production:boolean,
  socketIo:{url:string},
  logLevel:'verbose'|'debug'|'log'|'info'|'warn'|'error'

}
