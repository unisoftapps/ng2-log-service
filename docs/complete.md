## How it works

The Log Service dispatches log events to Log Listeners that are configured to listen to event(s) that match its configuration. **It is up to the LogListener to do something with the log event!** This framework does not actually log anything for you to the console or otherwise automatically. 

1. You register log listener(s) that are configured to respond to certain log events
2. When a LogService method is called, it checks against the list of registered log listeners
3. If a match is found, It will notify that listener of the log event

When you call a method on the LogService, nothing actually happens, unless you register a Log Listener that is configrued accordingly to respond to a log service event.

## Setting up a Listener

The first thing you must do is create a Log Listener. A Log Listener must implement the ILogListener interface.

```typescript
import { Injectable } from '@angular/core';
import { ILogListener, ALL, LogLevel, ILogMessage } from 'ng2-log-service';

@Injectable()
export class ConsoleListener implements ILogListener {

    // Required. What namespace you want to listen for
    namespace = ALL;
    
    // Required. What Level you want to listen to. 
    level = LogLevel.All; // log level

    // Required. Method to run when a log event is raised matching your configuration
    onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
        // do what you want here
        console.log(namespace, level, logMessage);
    }
}
```

## ILogListener ##

Log listeners must implement this interface. You must specify a:

- namespace : string
- level : LogLevel
- onLog(namespace: string, level: LogLevel, logMessage: ILogMessage)

### namespace

The namespace must match this Regular Expression:
```
^[a-zA-Z0-9\:\*]{1,}$
```

The namespace must be a string with
- no spaces
- only letters and/or numbers
- Can contain multiple ':' characters. This is used to designate a hieracrchy in log namespaces
- Can contain a single wildcard character '*'. This will match anything excactly before or match anything after the wildcard.

The ALL constant defined in the ng2-log-service module is just '*'. This means it will listen to all namespaces.

### Valid namespaces

Examples of some valid namespaces

```
namespace = ALL; // equivalent to '*'
namespace = 'api';
namespace = 'api:authentication';
namespace = 'api*; // matches api and api:authentication, etc
namespace = 'api:auth*'; // matches 'api:auth', 'api:authentication', 'api:authorize'
 ```

### level

Must be one the following enum values:
```typescript
export enum LogLevel {
  All = 1,
  Debug = 2,
  Info = 3,
  Warn = 4,
  Error = 5,
  Fatal = 6
}
```

You must define a Log Level your listener will listen to. Whatever Log Level you specify it will include that and anything above it.

```
level = LogLevel.Info; // Registers for Info, Warn, Error, Fatal
```

### onLog(namespace: string, level: LogLevel, logMessage: ILogMessage)

This method will be fired when a log event matches your namespace and log level. It contains the namespace, log level, and log message. The logMessage contains a message and an optional object.

```typescript
interface ILogMessage {
  message: string;
  obj?: any;
}
```

If I log this:

```typescript
this.logService.info('Hello World!', { data: [1,2,3] });
```

My logMessage object would look like this:

```typescript
{
    message: 'Hello World!',
    obj: { data: [1,2,3] }
}
```