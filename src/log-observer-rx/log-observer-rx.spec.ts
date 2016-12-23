///<reference path="./../../typings/globals/jasmine/index.d.ts"/>

import { inject } from '@angular/core/testing';
import { namespaceIsValid, logMessageIsValid, ILogEvent, LogLevel, ILogListener, ILogMessage, LogObserverRx, ALL } from '../';

class Listener implements ILogListener {
    namespace: string = ALL;
    level: LogLevel = LogLevel.All

    onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
        console.log('got message', namespace, level, logMessage);
    }

}


// describe('LogObserverRx tests', () => {
    
//     let listener = new Listener();

//     let logObserverRx = new LogObserverRx();
//     logObserverRx.register(listener);

//     logObserverRx.onDidLog(ALL, LogLevel.All, () : ILogMessage => {
//         return {
//             message: 'Test Message',
//             obj: null
//         }
//     });

//     console.log('inside here!');

//})