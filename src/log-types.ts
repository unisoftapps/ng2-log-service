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
  log(arg: string, obj: any, level: LogLevel);
  error(arg: string, obj: any, level: LogLevel);
  warn(arg: string, obj: any, level: LogLevel);
  info(arg: string, obj: any, level: LogLevel);
  debug(arg: string, obj: any, level: LogLevel);
};

export interface ILogEvent {
  () : ILogMessage
}

export interface ILogMessage {
  message: string;
  obj?: any;
}

export interface ILogMessager {
  messageSent(message: string, payload?: any);
}

export abstract class ILogListener {
  namespace: string = ALL;
  level: LogLevel;
  abstract onLog(namespace: string, level: LogLevel, logMessage: ILogMessage);
}

export interface ILogObserver {
  onDidLog(namespace: string, level: LogLevel, action: ILogEvent);
  register(listener: ILogListener);
  getListener(listener: Function);
}

