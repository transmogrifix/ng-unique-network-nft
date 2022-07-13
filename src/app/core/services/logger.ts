const addLeadZero = (num: any) => {
  if (num < 10) return `0${num}`;
  return `${num}`;
};


export class Logger {
  static FORMATS = {
    cmd: { reset: 0, bright: 1, dim: 2, underscore: 4, blink: 5, reverse: 7, hidden: 8 },
    fg: { black: 30, red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, white: 37, crimson: 38 },
    bg: { black: 40, red: 41, green: 42, yellow: 43, blue: 44, magenta: 45, cyan: 46, white: 47, crimson: 48 }
  };

  static LEVEL = {
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
    NONE: 'NONE'
  };

  static LEVEL_COLOR = {
    ERROR: 'fg.red',
    WARNING: 'fg.yellow',
    INFO: 'fg.green'
  }

  static getFmt(fmt: any) {
    let format: any = this.FORMATS;
    for (let part of fmt.split('.')) {
      format = typeof format !== 'undefined' ? format[part] : format;
    }
    if (typeof format !== 'number') format = this.FORMATS.cmd.reset;
    return format;
  }

  static getFmtSymbol(code: any) {
    return `\x1b[${code}m`;
  }

  static getTimestamp() {
    let d = new Date(),
      year = d.getFullYear(), month = addLeadZero(d.getMonth() + 1), date = addLeadZero(d.getDate()),
      hour = addLeadZero(d.getHours()), min = addLeadZero(d.getMinutes()), sec = addLeadZero(d.getSeconds());
    return `${year}-${month}-${date} ${hour}:${min}:${sec}`;
  }

  static formatString(str: string, fmt: any) {
    const fmtSymbol = this.getFmtSymbol(this.getFmt(typeof fmt === 'undefined' ? '' : fmt));
    return `${fmtSymbol}${str}${this.getFmtSymbol(this.FORMATS.cmd.reset)}`;
  }

  public includeTime: boolean = true;
  public defaultLevel: any;
  public level: any;

  constructor(includeTime = true, defaultLevel = Logger.LEVEL.INFO) {
    this.includeTime = includeTime;
    this.defaultLevel = defaultLevel;
    this.level = JSON.parse(JSON.stringify(Logger.LEVEL));
  }

  fmtSymbol(fmt: any) {
    return Logger.getFmtSymbol(Logger.getFmt(fmt));
  }

  fmt(str: any, fmt: any) {
    return Logger.formatString(str, fmt);
  }

  write(...messages: any) {
    console.log(...messages);
  }

  constructLog(message: any, level: any) {
    if (typeof level === 'undefined') level = this.defaultLevel;
    if (level === Logger.LEVEL.ERROR) {
      message = message?.stack || message;
    }

    let rawMsgs = Array.isArray(message) ? message : [message],
      msgs = level !== Logger.LEVEL.NONE ? [`${Logger.LEVEL_COLOR.hasOwnProperty(level) ? this.fmt(level, Logger.LEVEL_COLOR[level]) : level}:`] : [];
    for (let msg of rawMsgs) {
      try {
        if (typeof msg !== 'string') {
          msgs.push(JSON.stringify(msg));
        } else {
          msgs.push(msg);
        }
      } catch (e) {
        console.error(this.fmtSymbol('fg.red'), e, this.fmtSymbol('cmd.reset'));
      }
    }
    if (this.includeTime) msgs = [`[${this.fmt(Logger.getTimestamp(), 'fg.cyan')}]`, ...msgs];
    return msgs;
  }

  log(message: any, level: any) {
    this.write(...this.constructLog(message, level));
  }
}


export class SilentLogger extends Logger {
  public override write(...messages: any) {
    return;
  }
}
