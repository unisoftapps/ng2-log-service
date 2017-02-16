import { Injectable } from '@angular/core';
import {  ILogListener, ILogMessage, LogLevel, ALL } from '../ng2-log-service';

export interface IConsoleListenerPrefix {
    () : string;
}

export class ConsoleListenerConfig {
    prefixLogsWithNamespace: boolean = true;
    namespaceWhiteList: Array<string> = [ALL];
    enabled: boolean = true;
    logLevel: LogLevel;
    prefix: IConsoleListenerPrefix;
    enablePrefix: boolean = false;
}

let defaultConfig = {
    prefixLogsWithNamespace: true,
    namespaceWhiteList: [ALL],
    enabled: true,
    prefix: () => {
        return "";
    },
    enablePrefix: true,
    logLevel: LogLevel.All
}

export class ConsoleListener implements ILogListener {
    
    namespace = ALL;
    level = LogLevel.All;

    constructor(private config: ConsoleListenerConfig) {
        // merge default config with config 
        this.setConfig(config);
    }

    setConfig(config: ConsoleListenerConfig) {
        this.config = Object.assign(defaultConfig, config);
        this.level = this.config.logLevel;
    }

    // returns copy of config
    getConfig() : ConsoleListenerConfig {
        return Object.assign({}, this.config);
    }

    onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
        if(!this.config.enabled) {
            return false;
        }

        if(!this.inWhitelist(namespace)) {
            return false;
        }

        if(level < this.config.logLevel) {
            return false;
        }


        var prefix = this.prefix(namespace);
        if(this.config.prefixLogsWithNamespace) {
            prefix += namespace+': ';
        }

        var log = prefix + logMessage.message;

        switch(level) {
            case LogLevel.Debug:
                console.debug(log, this.beautifyObjectForConsole(logMessage.obj));
                break;
            case LogLevel.Info:
                console.info(log, this.beautifyObjectForConsole(logMessage.obj));
                break;
            case LogLevel.Warn:
                console.warn(log, this.beautifyObjectForConsole(logMessage.obj));
                break;
            case LogLevel.Error:
            case LogLevel.Fatal:
                console.error(log, this.beautifyObjectForConsole(logMessage.obj));
                break;
            case LogLevel.All:
            default:
                console.log(log, this.beautifyObjectForConsole(logMessage.obj));
                break;
        }
    }

    private beautifyObjectForConsole(obj: any) {
        if(!obj) {
            return null;
        }
        return JSON.stringify(obj, null, 2)
    }

    private prefix(namespace: string) : string {
        if(!this.config.enablePrefix) {
            return "";
        }
        var prefix = this.config.prefix();
        return prefix;
    }

    private inWhitelist(namespace: string) : boolean {
        
        if(this.config.namespaceWhiteList.indexOf(ALL) !== -1) {
            return true;
        }
        
        if(this.config.namespaceWhiteList.indexOf(namespace) !== -1) {
            return true;
        }

        return false;
    }
}