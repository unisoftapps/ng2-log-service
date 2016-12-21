import { ILogListener } from './log-types';
import { LogObserverService } from './log-observer.service';
import { LogService } from './log.service';

export function logObserverProvider(...args: ILogListener[]) {
    return {
        provide: LogObserverService,
        useFactory: (): LogObserverService => {
            return new LogObserverService(args);
        }
    }
}