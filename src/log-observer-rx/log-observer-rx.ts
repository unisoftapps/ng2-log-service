import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ILogObserver, ILogEvent, ILogListener, LogLevel, namespaceIsValid } from '../';


@Injectable()
export class LogObserverRx implements ILogObserver {

    private _observerables: Array<Observable<any>> = [];

    constructor() {
        
    }

    onDidLog(namespace: string, level: LogLevel, action: ILogEvent) {

    }
    register(listener: ILogListener) {
        console.log('registser ',listener);
    }
    getListener(listener: Function) {

    }
}