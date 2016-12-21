import { LogObserverService } from './log-observer.service';
import { LogService } from './log.service';

export let logProvider = {
    provide: LogService,
    useFactory: (observer)  => { 
    return new LogService(observer); 
    },
    deps: [LogObserverService]
}