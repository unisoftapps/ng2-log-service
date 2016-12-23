# ng2-log-service

Angular 2 Logging Service thats follows the Observer pattern. Log listeners listen to log events and are notified when they occur.

To run the example tests, issue the following commands:

## Installation ##

```
npm install --save unisoftapps/ng2-log-service
```

## Full Documentation ##
[View Complete Documentation](docs/complete.md)

## Example Usage ##

### 1. Create a Class that Implements ILogListener ###

```typescript
	
import { Injectable } from '@angular/core';
import { ILogListener, ALL, LogLevel, ILogMessage } from 'ng2-log-service';

@Injectable()
export class ConsoleListener implements ILogListener {
    
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
// Include the LogModule
import { LogModule } from 'ng2-log-service';
// Import Your Console Listeners you want to register
import { ConsoleListener } from './console-listener';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LogModule.forRoot(new ConsoleListener())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 3. Use the Log Service ###

```typescript
import { logProvider, LogService, LogLevel, ILogMessage } from 'ng2-log-service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss'],
  providers: [logProvider] // Inject a log service instance
})
export class LandingPage implements OnInit {
  
  constructor(private logService: LogService) {}

ngOnInit() {

	this.logService.namespace = 'LandingPage'; // specify a namespace for the logs
	this.logService.log('Landing page log', LogLevel.All);
    this.logService.info('Landing page info');
    this.logService.debug('Landing page debug');
    this.logService.warn('Landing page warn');
    this.logService.error('Landing page error');
	this.logService.fatal('Landing page fatal error');

	// Deferred execution of your log. Will not execute unless a listener is subscribed.
	this.logService.logAsync(LogLevel.Warn, (): ILogMessage => {
		// do some work
		// must return an ILogMessage object
		return {
			message: 'hello world!'+this.translate.currentLang,
			obj: {dummy: 'data'}
		};
    });

}
```
## Licensing

This software is licensed with the MIT license.

