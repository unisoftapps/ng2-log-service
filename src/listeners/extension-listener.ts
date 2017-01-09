import {  ILogListener, ILogMessage, LogLevel, ALL } from '../ng2-log-service';

export class ExtensionListener implements ILogListener {

    namespace = ALL; // what namespace you want to listen for
    level = LogLevel.All; // log level

    onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
        var event = new CustomEvent('logMonitorEvent', { 
            detail: {
                message: logMessage.message,
                namespace: namespace,
                level: level,
                data: logMessage.obj
            }
        });
        setTimeout(() => {
            window.dispatchEvent(event);
        }, 0);
    }

}