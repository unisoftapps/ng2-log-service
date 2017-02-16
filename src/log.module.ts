import { NgModule, ModuleWithProviders } from '@angular/core';
import { LogObserverService, ILogListener } from './ng2-log-service';

@NgModule({
  imports: [
  ],
  exports: [
  ],
  providers: [
      LogObserverService
  ]
})
export class LogModule {}