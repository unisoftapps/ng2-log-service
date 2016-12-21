import { AsyncSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ILogObserver, ILogEvent, ILogListener, LogLevel, namespaceIsValid } from './';

let FUZZY_CHARACTER: string = '*';
let INDEX_NOT_FOUND = -1;
export let ALL_LOGS: string = FUZZY_CHARACTER;


@Injectable()
export class LogObserverService implements ILogObserver {
  
  private registry: { [namespace: string]: Array<ILogListener> };
  private listeners: Array<ILogListener> = [];

  constructor(args: Array<ILogListener> = [] ) {

    this.registry = {}
    this.registry[ALL_LOGS] = [];

    // register listeners
    for(var i in args) {
      this.register(args[i]);
    }

  }

  // returns a listener from the registry
  public getListener(listener: Function) {
    var match = this.listeners.filter((l) => {
      if(l instanceof listener) {
        return l;
      }
    })[0];
    return match;
  }

  public register(listener: ILogListener) {
    //console.debug('register for '+listener.namespace);

    if(!namespaceIsValid(listener.namespace)) {
      throw 'Listener cannot register to (null) Namespace';      
    }

    if(!this.namespaceInRegistry(listener.namespace)) {
      this.registry[listener.namespace] = [];
    }
    this.registry[listener.namespace].push(listener);
    this.listeners.push(listener);
  }

  public unregister(listener: ILogListener) {
    if(this.namespaceInRegistry(listener.namespace)) {
      var listeners = this.registry[listener.namespace];
      let index = listeners.indexOf(listener);
      listeners.splice(index, 1);

      // remove from listeners
      // index = this.listeners.indexOf(listener);
      // listeners.splice(index, 1);

      // remove completely if no listeners
      if(listeners.length === 0) {
        delete(this.registry[listener.namespace]);
      }
    }
  };

  public onDidLog(namespace: string, level: LogLevel, action: ILogEvent) {
    if(!namespaceIsValid(namespace)) {
      throw 'Invalid Log Entry! namespace cannot be (null)';      
    }
    var listeners = this.listenersToNotify(namespace, level);
    if(listeners.length) {
      var logMessage = action();
      listeners.forEach((listener) => {
        listener.onLog(namespace, level, logMessage);
      });
    }
  }

  private exactListenersToNotify(namespace: string, level: LogLevel) : Array<ILogListener> {
    var listeners = [];

    if(this.namespaceInRegistry(namespace)) {
      listeners = this.extractQualifiedListenersForLogLevel(this.registry[namespace], level);
    }    

    return listeners;
  }

  private extractQualifiedListenersForLogLevel(listeners: Array<ILogListener>, level: LogLevel) : Array<ILogListener> {
    var qualifiedListeners = [];
    listeners.forEach((listener) => {
      if(level >= listener.level) {
        qualifiedListeners.push(listener);
      }

    });
    return qualifiedListeners;
  }

  private fuzzyListenersToNotify(namespace: string, level: LogLevel ) : Array<ILogListener> {
    var listeners = [];
    Object.keys(this.registry).forEach((key) => {
      if(key.indexOf(FUZZY_CHARACTER) !== INDEX_NOT_FOUND) {
        if(key === FUZZY_CHARACTER) {
          listeners = listeners.concat(this.extractQualifiedListenersForLogLevel(this.registry[key], level));
          return;
        }
        var startsWith = key.split(FUZZY_CHARACTER)[0];
        if(namespace.indexOf(startsWith) !== INDEX_NOT_FOUND) {
          listeners = listeners.concat(this.extractQualifiedListenersForLogLevel(this.registry[key], level));
        }
      }
    });
    return listeners;
  };

  protected listenersToNotify(namespace: string, level: LogLevel) : Array<ILogListener> {
    var listeners = [];
    // exact match listeners that qualify
    if(this.namespaceInRegistry(namespace)) {
      listeners = this.exactListenersToNotify(namespace, level);
    }
    // fuzzy match listeners that qualify
    listeners = listeners.concat(this.fuzzyListenersToNotify(namespace, level));
    return listeners;
  }

  public namespaceInRegistry(namespace: string) : boolean {    
    return (namespace in this.registry);
  }

  public countListenersForNamespace(namespace: string) : number {
    if(!this.namespaceInRegistry(namespace)) {
      return 0;
    }
    return this.registry[namespace].length;
  }
}