# ng2-log-service

Angular 2 Logging Service. Log listeners listen to log events and are notified when they occur.

## Installation ##

```
npm install --save ng2-log-service
```

## Full Documentation ##
[View Complete Documentation](docs/complete.md)

## Example Usage ##

### 1. Create a Class that Implements ILogListener ###

```typescript
	
import { Injectable } from '@angular/core';
import { ILogListener, ALL, LogLevel, ILogMessage } from 'ng2-log-service';

@Injectable()
export class MyCustomListener implements ILogListener {
    
    namespace = ALL; // what namespace you want to listen for
    level = LogLevel.All; // log level

    onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
        // do what you want here
        console.log(namespace, level, logMessage);
    }

}
```

### 2. Register Your Listener(s) in your App Root Module ###


```typescript
// Include the LogModule and bundled Console Listener
import { LogModule, ConsoleListener } from 'ng2-log-service';
// Import Your Log Listeners you want to register
import { MyCustomListener } from './listeners/my-custom-listener';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LogModule.forRoot(new ConsoleListener(), new MyCustomListener())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 3. Use the Log Service ###

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

## Licensing

This software is licensed with the MIT license.

