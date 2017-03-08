import { ALL } from './log-observer.service';

export enum LogLevel {
  All = 1,
  Debug = 2,
  Info = 3,
  Warn = 4,
  Error = 5,
  Fatal = 6
}

export interface ILog {
  log(arg: string, obj: any, level: LogLevel) : void;
  error(arg: string, obj: any, level: LogLevel) : void;
  warn(arg: string, obj: any, level: LogLevel) : void;
  info(arg: string, obj: any, level: LogLevel) : void;
  debug(arg: string, obj: any, level: LogLevel) : void;
};

export interface ILogEvent {
  () : ILogMessage
}

export interface ILogMessage {
  message: string;
  obj?: any;
}

export interface ILogMessager {
  messageSent(message: string, payload?: any) : void;
}

export abstract class ILogListener {
  namespace: string = ALL;
  level: LogLevel;
  abstract onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) : void;
}

export interface ILogObserver {
  onDidLog(namespace: string, level: LogLevel, action: ILogEvent) : void;
  register(listener: ILogListener) : void;
  getListener(listener: Function) : void;
}

