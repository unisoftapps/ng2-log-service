import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { ILogObserver, ILogEvent, ILogListener, LogLevel, namespaceIsValid } from '../';

export interface IRegistryDictionary { 

}

export interface IRegistryItem {
    namespace: string;
    level: LogLevel;
}

@Injectable()
export class LogObserverRx implements ILogObserver {

    private _subjects: { [namespace: string]: Subject<any> } = {};
    private _registry: { [namespace: string]: Array<ILogListener> } = {};

    constructor() {
    }

    onDidLog(namespace: string, level: LogLevel, action: ILogEvent) {
        console.log('on did log!', namespace, level, action);

        if(!namespaceIsValid(namespace)) {
            throw 'Invalid Log Entry! namespace cannot be (null)';      
        }
        var listeners = this.extractListenersToNotify(namespace, level);
        if(listeners.length) {

            console.log('found listener! '+listeners.length);

            var logMessage = action();

            this._subjects[namespace].next(logMessage);


            // listeners.forEach((listener) => {
            //     listener.onLog(namespace, level, logMessage);
            // });
        }

    }

    private extractListenersToNotify(namespace: string, level: LogLevel) : Array<ILogListener> {
        var listeners = [];

        if(this.namespaceInRegistry(namespace)) {
            listeners = this.extractQualifiedListenersForLogLevel(this._registry[namespace], level);
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

    private namespaceInRegistry(namespace: string) : boolean {    
        return (namespace in this._registry);
    }

    private registerListener(listener: ILogListener) {

        if(!(listener.namespace in this._registry)) {
            //console.log('no listener yet!');
            this._registry[listener.namespace] = [];            
        }
        this._registry[listener.namespace].push(listener);
    }

    private registerSubject(namespace: string) {
        if(!(namespace in this._subjects)) {
            //console.log('no subject yet!');
            this._subjects[namespace] = new Subject();   
            this._subjects[namespace].subscribe(val => {
                this._registry[namespace].forEach((listener: ILogListener) => {
                    listener.onLog('asdfasfd', LogLevel.All, val);
                });
            });  
        }
    }

    register(listener: ILogListener) {
        //console.log('trying to register... ',listener);
        this.registerListener(listener);
        this.registerSubject(listener.namespace);
    }

    getListener(listener: Function) {

    }
}