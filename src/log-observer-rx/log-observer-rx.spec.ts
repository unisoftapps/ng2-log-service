///<reference path="./../../typings/globals/jasmine/index.d.ts"/>

import { inject } from '@angular/core/testing';
import { namespaceIsValid, logMessageIsValid, ILogEvent, LogLevel, ILogListener, ILogMessage, LogObserverRx } from '../';

class Listener implements ILogListener {
    namespace: string = 'test';
    level: LogLevel = LogLevel.All

    onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
        console.log('got message', namespace, level, logMessage);
    }

}


describe('LogObserverRx tests', () => {
    
    let listener = new Listener();

    let logObserverRx = new LogObserverRx();
    logObserverRx.register(listener);

    console.log('inside here!');

})