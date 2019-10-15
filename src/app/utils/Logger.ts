import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';

export type ILogCall = (...args: any[]) => void;

const debugLevels = {
  verbose:5,
  log:4,
  info:3,
  debug:2,
  warn:1,
  error:0
};

const debugLevelsStyle = {
  verbose:'color: #999',
  log:'color: #333',
  info:'color: #666',
  debug:'color: teal; font-weight: 700',
  warn:'color: orange',
  error:'color: #FF33300, '
};

const C2Background = {
  'A':'#FF9',
  'B':'#EE3',
  'C':'#bdff16',
  'D':'#0cddff',
  'E':'#a303ff',
  'F':'#0affb9',
  'G':'#ffbd09',
  'H':'#00a6ff',
  'I':'#c1ffff',
  'J':'#a3bfff',
  'K':'#a9deff',
  'L':'#b2fdff',
  'M':'#b9ffde',
  'N':'#beffc1',
  'O':'#d9ffbe',
  'P':'#fbffb2',
  'R':'#ffeabe',
  'S':'#ffb9a0',
  'T':'#ffabac',
  'Q':'#ffa2c0',
  'U':'#ff82cb',
  'V':'#ff79db',
  'W':'#90fdff',
  'X':'#c475ff',
  'Y':'#8bb0ff',
  'Z':'#99F'
};

export interface ILogger {
  // Identical to angular's definition
  debug: ILogCall;
  error: ILogCall;
  info: ILogCall;
  log: ILogCall;
  warn: ILogCall;
  // Our extensions
  verbose: ILogCall;
}

const levelToConsoleMethod = {
  verbose:'info',
  log:'log',
  info:'info',
  debug:'debug',
  warn:'warn',
  error:'error'
};


const getColorByWordPRand = (word: string) => {
  let color = '#';
  let max = 6;
  let getXX = function(index) {
    let p = [];
    let count = 0;
    while (count < max) {
      if (index >= word.length) {
        index = 0;
      }
      p.push(word.charCodeAt(index));
      count++;
      index++;
    }

    let a = (p[2] * p[1] + p[1]) % 16;
    if (a < 8) {
      a += 8;
    }
    const b = (p[3] * p[4] + p[5]) % 16;
    return (a).toString(16) + b.toString(16);
  };

  color += getXX(0) + getXX(max) + getXX(max * 2);
  return color;
};

const logging: Subject<string> = new Subject();

export const logging$ = logging.asObservable();

export const createLogger = (context: string): ILogger => {
  const op = (level: string) =>
    (...args: any[]) => {
      const [originalMessage, ...tail] = args;
      const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
      ;
      const formattedMessage = `${timestamp} %c[${context}]%c ${originalMessage}`;
      const method = levelToConsoleMethod[level];
      if (method) {
        console[method](...[formattedMessage, `background: ${getColorByWordPRand(context)}`, debugLevelsStyle[level], ...tail]);
      }

      logging.next(timestamp.concat(...[' ', `${method} [${context}] ${originalMessage}`, ...tail]));
    };


  const getOpOrNoop = (level: string) => (debugLevels[environment.logLevel] >= debugLevels[level]) ? op(level) : () => {
  };

  const loggerInstance = {
    debug:getOpOrNoop('log'),
    error:getOpOrNoop('error'),
    info:getOpOrNoop('info'),
    log:getOpOrNoop('log'),
    warn:getOpOrNoop('warn'),
    verbose:getOpOrNoop('verbose')
  };

  return loggerInstance;
};
