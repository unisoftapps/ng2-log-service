## How it works

The Log Service dispatches log events to Log Listeners that are configured to listen to event(s) that match its configuration. **It is up to the LogListener to do something with the log event!** This framework does not actually log anything for you to the console or otherwise automatically. 

We do however provide a ConsoleListener you can use out of the box to log to the console window.

1. You register log listener(s) that are configured to respond to certain log events
2. When a LogService method is called, it checks against the list of registered log listeners
3. If a match is found, It will notify that listener of the log event

When you call a method on the LogService, nothing actually happens, unless you register a Log Listener that is configrued accordingly to respond to a log service event.

### Chrome Extension

There is a free Chrome Extension for ng2-log-service. Learn more here: [https://github.com/unisoftapps/ng2-log-service-extension](https://github.com/unisoftapps/ng2-log-service-extension)

## Setting up a Listener

The first thing you must do is create a Log Listener. A Log Listener must implement the ILogListener interface.

```typescript
import { Injectable } from '@angular/core';
import { ILogListener, ALL, LogLevel, ILogMessage } from 'ng2-log-service';

@Injectable()
export class MyCustomListener implements ILogListener {

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
namespace = 'api'; // only 'api', nothing more, nothing less
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

## Registering Listeners with LogModule

You must register your Log Listeners inside your Application's root module. 
In this example, we will show how you would register the bundled ConsoleListener along with a user defined listener.

```typescript
// Include the LogModule and Bundled ConsoleListener
import { LogModule, ConsoleListener } from 'ng2-log-service';

// Include your own listener
import { MyCustomListener } from './listeners/my-custom-listener';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // You can register as many listeners as you want here
    LogModule.forRoot(new ConsoleListener(), new MyCustomListener())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Use the Log Service

Now that everything is wired up, start using the LogService.

### How to use the LogService inside of a Component

Make sure you include the ```logServiceProvider``` inside your component. This will give you a new instance of a Log Service. This is done so you can have different namespaces defined within your application. You could inject a logServiceProvider into a module so everything in that module will share the same LogService instance.


```typescript
import { logServiceProvider, LogService, LogLevel, ILogMessage } from 'ng2-log-service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss'],
  providers: [logServiceProvider] // Inject the logServiceProvider
})
export class LandingPage implements OnInit {
  
  constructor(private logService: LogService) {}

    ngOnInit() {
        
        // specify a namespace for the logs
    	this.logService.namespace = 'LandingPage'; 
    	
    	// All of these methods support passing in any object as a second parameter
    	this.logService.log('Landing page log', { data: 'optional' });
        this.logService.info('Landing page info');
        this.logService.debug('Landing page debug');
        this.logService.warn('Landing page warn');
        this.logService.error('Landing page error');
    	this.logService.fatal('Landing page fatal error');
    
    	// Deferred execution of your log. Will not execute unless a listener is subscribed.
    	// If you need to do any 'heavy lifting' before logging a message, use logDeferred.
    	// This will only execute if there is at least on subscriber.
    	this.logService.logDeferred(LogLevel.Warn, (): ILogMessage => {
    		// do some work
    		// must return an ILogMessage object
    		return {
    			message: 'hello world!'+this.translate.currentLang,
    			obj: {dummy: 'data'}
    		};
        });

    }
}
```

Every time you log with the logService, it will find any registered subscribers and notify them by calling the ```onLog``` method.