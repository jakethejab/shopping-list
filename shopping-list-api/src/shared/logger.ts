import * as colors from 'colors';

export enum LoggerColor {
  Red = 'red',
  Green = 'green',
  Yellow = 'yellow',
  Blue = 'blue',
  Magenta = 'magenta',
  Cyan = 'cyan',
  White = 'white',
  Black = 'black',
  Gray = 'gray',
  Grey = 'grey'
}

export class Logger {
  private prefix?: string;
  private color: string;

  constructor(prefix?: string, color?: LoggerColor) {
    this.prefix = prefix;
    this.color = color ?? LoggerColor.Blue;
  }

  debug(context: string, message: string, ...params: any[]): void {
    console.info(`${this.getPrefix(context, 'DEBUG')} ${message}`, ...params);
  }

  error(context: string, message: string, ...params: any[]): void {
    console.error(`${this.getPrefix(context, 'ERROR')} ${colors.red(message)}`, ...params);
  }

  warn(context: string, message: string, ...params: any[]): void {
    console.warn(`${this.getPrefix(context, 'WARN')} ${colors.yellow(message)}`, ...params);
  }

  /**
   * Contructs the prefix for the log and returns it as colorized
   * @param context The context for the log, typically it will be the method name
   * @param type The type of log (DEBUG | ERROR | WARN)
   * @returns A colorized prefix string
   */
  private getPrefix(context: string, type: string): string {
    const prefix = this.prefix ? `${this.prefix}:${context}:${type}` : context;

    return colors[this.color](prefix);
  }
}
