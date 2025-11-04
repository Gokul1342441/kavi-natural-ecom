type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level?: LogLevel;
}

class SimpleLogger {
  private level: LogLevel;
  private isDev: boolean;

  constructor(options: LoggerOptions = {}) {
    this.isDev = process.env.NODE_ENV !== 'production';
    this.level = options.level || (this.isDev ? 'debug' : 'info');
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    return levels[level] >= levels[this.level];
  }

  private formatMessage(level: LogLevel, message: string, data?: Record<string, any>): string {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    const prefix = `[${level.toUpperCase()}] [${timestamp}]`;
    
    if (!data) {
      return `${prefix} ${message}`;
    }
    
    const dataStr = JSON.stringify(data).replace(/\n/g, ' ');
    return `${prefix} ${message} ${dataStr}`;
  }

  debug(data: Record<string, any> | string, message?: string): void {
    if (!this.shouldLog('debug')) return;
    
    if (typeof data === 'string') {
      console.debug(this.formatMessage('debug', data));
    } else {
      console.debug(this.formatMessage('debug', message || '', data));
    }
  }

  info(data: Record<string, any> | string, message?: string): void {
    if (!this.shouldLog('info')) return;
    
    if (typeof data === 'string') {
      console.info(this.formatMessage('info', data));
    } else {
      console.info(this.formatMessage('info', message || '', data));
    }
  }

  warn(data: Record<string, any> | string, message?: string): void {
    if (!this.shouldLog('warn')) return;
    
    if (typeof data === 'string') {
      console.warn(this.formatMessage('warn', data));
    } else {
      console.warn(this.formatMessage('warn', message || '', data));
    }
  }

  error(data: Record<string, any> | string, message?: string): void {
    if (!this.shouldLog('error')) return;
    
    if (typeof data === 'string') {
      console.error(this.formatMessage('error', data));
    } else {
      console.error(this.formatMessage('error', message || '', data));
    }
  }
}

const logger = new SimpleLogger();

export default logger;
