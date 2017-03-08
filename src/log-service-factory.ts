import { LogService } from './log.service';
import { Observable, AsyncSubject } from 'rxjs';
import { ILog, ILogEvent, LogObserverService, LogLevel } from './ng2-log-service';
import { Injectable, EventEmitter, Inject } from '@angular/core';

@Injectable()
export class LogServiceFactory {

    constructor(private logObserver: LogObserverService) {
        
    }

    public newLogService() {
        return new LogService(this.logObserver);
    }

}