import { LogObserverService } from './log-observer.service';
import { LogService } from './log.service';

export let logServiceProvider = {
    provide: LogService,
    useFactory: (observer)  => { 
    return new LogService(observer); 
    },
    deps: [LogObserverService]
}