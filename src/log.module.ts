import { NgModule, ModuleWithProviders } from '@angular/core';
import { LogObserverService, ILogListener } from './';

@NgModule({
  imports: [
  ],
  exports: [
  ],
  providers: [
  ]
})
export class LogModule {

    static forRoot(...args: ILogListener[]) : ModuleWithProviders {
        return {
            ngModule: LogModule,
            providers: [
                {
                    provide:LogObserverService,
                    useFactory: () : LogObserverService => {
                        return new LogObserverService(args);
                    }
                }
            ]        
        }
    }
}