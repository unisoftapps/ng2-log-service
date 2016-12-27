///<reference path="./../typings/globals/jasmine/index.d.ts"/>

import { ILogListener, ILogMessage } from './';
import { TestBed, async, inject } from '@angular/core/testing';
import { LogObserverService, ALL, LogLevel } from './';


class GlobalLogListener implements ILogListener {
  didGetNotified: boolean = false; 
  namespace = ALL;
  level = LogLevel.All;  
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    //console.log('GlobalLogListener got it!', logMessage.message);
    this.didGetNotified = true;
  }
} 

class DummyNamespaceListenerA implements ILogListener {
  didGetNotified: boolean = false;
  namespace = 'dummynamespace';
  level = LogLevel.All;  
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    //console.log('DummyNamespaceListenerA got it!', logMessage.message);
    this.didGetNotified = true;
  }
} 

class DummyNamespaceListenerB implements ILogListener {
  didGetNotified: boolean = false;
  namespace = 'dummynamespace';
  level = LogLevel.All;  
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    //console.log('DummyNamespaceListenerB got it!', logMessage.message);
    this.didGetNotified = true;
  }
} 

class DummyFuzzyNamespaceListener implements ILogListener {
  didGetNotified: boolean = false;
  namespace = 'dummyname*';
  level = LogLevel.All;  
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    //console.log('DummyFuzzyNamespaceListener got it!', logMessage.message);
    this.didGetNotified = true;
  }
}

class DummyErrorOnlyListener implements ILogListener {
  didGetNotified: boolean = false;
  level = LogLevel.Error;
  namespace = 'dummyname';
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    //console.log('DummyErrorOnlyListener got it!', logMessage.message);
    this.didGetNotified = true;
  }
}


describe('Service: LogObserverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LogObserverService,
          useFactory: () => {
            return new LogObserverService();
          }
        }
      ]
    });
  });

  it('should ...', inject([LogObserverService], (service: LogObserverService) => {
    expect(service).toBeTruthy();
  }));

  it('throw exception for registering listener on (null) namespace ...', inject([LogObserverService], (service: LogObserverService) => {
    
    let listener = new DummyNamespaceListenerA();
    listener.namespace = null;
    expect(() => service.register(listener)).toThrow();
  }));

  it('throw exception for calling onDidLog where namespace is (null) ...', inject([LogObserverService], (service: LogObserverService) => {

    expect(() => service.onDidLog(null, LogLevel.All, () => {
      return {
        message: "Test Log"
      }
    })).toThrow();
  }));

  it('should register ILogListener ...', inject([LogObserverService], (service: LogObserverService) => {
    
    let listener = new DummyNamespaceListenerA();
    service.register(listener);

    var actual = service.namespaceInRegistry(listener.namespace);
    expect(actual).toBeTruthy();

  }));

  it('should unregister ILogListener ...', inject([LogObserverService], (service: LogObserverService) => {
    
    let listener = new DummyNamespaceListenerA();
    service.register(listener);
    service.unregister(listener);

    var actual = service.namespaceInRegistry(listener.namespace);
    expect(actual).toBeFalsy();

  }));

  it('should register multiple listeners to same namespace ...', inject([LogObserverService], (service: LogObserverService) => {
    
    let listenerA = new DummyNamespaceListenerA();
    let listenerB = new DummyNamespaceListenerB();
    service.register(listenerA);
    service.register(listenerB);

    var expected = 2;
    var actual = service.countListenersForNamespace(listenerA.namespace);
    expect(actual).toEqual(expected);

  }));

  it('should register multiple listeners to same namespace and remove 1 ...', inject([LogObserverService], (service: LogObserverService) => {
    
    let listenerA = new DummyNamespaceListenerA();
    let listenerB = new DummyNamespaceListenerB();
    service.register(listenerA);
    service.register(listenerB);

    service.unregister(listenerA);

    let expectedListenerCountOfUnregister = 1;

    var actualNamespaceExists = service.namespaceInRegistry(listenerA.namespace);
    var actualListenerCount = service.countListenersForNamespace(listenerA.namespace);

    expect(actualNamespaceExists).toBeTruthy();
    expect(actualListenerCount).toEqual(expectedListenerCountOfUnregister);

  }));

  it('fuzzy listener should listen to "dummyname" with registered namespace dummyname*', inject([LogObserverService], (service: LogObserverService) => {
    var dummyFuzzyListener = new DummyFuzzyNamespaceListener();
    service.register(dummyFuzzyListener);
    service.onDidLog("dummyname", LogLevel.All, () => {
      return {
        message: "Test Log"
      }
    });
    expect(dummyFuzzyListener.didGetNotified).toBeTruthy();
  }));

  it('global listener should listen to all log events...', inject([LogObserverService], (service: LogObserverService) => {
    var globalListener = new GlobalLogListener();
    service.register(globalListener);
    service.onDidLog("test", LogLevel.All, () => {
      return {
        message: "Test Log"
      }
    });
    expect(globalListener.didGetNotified).toBeTruthy();
  }));

  it('ErrorOnly listener should not be notified of ns: "dummyname" and level is All', inject([LogObserverService], (service: LogObserverService) => {

    var listener = new DummyErrorOnlyListener();
    service.register(listener);
    service.onDidLog("dummyname", LogLevel.All, () => {
      return {
        message: "Test Log"
      }
    });
    expect(listener.didGetNotified).toBeFalsy();
  }));

  it('ErrorOnly listener should be notified of ns: "dummyname" and level is Fatal', inject([LogObserverService], (service: LogObserverService) => {
    var listener = new DummyErrorOnlyListener();
    service.register(listener);
    service.onDidLog("dummyname", LogLevel.Fatal, () => {
      return {
        message: "Test Log"
      }
    });
    expect(listener.didGetNotified).toBeTruthy();
  }));

});