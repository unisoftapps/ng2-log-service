///<reference path="./../typings/globals/jasmine/index.d.ts"/>

import { inject } from '@angular/core/testing';
import { namespaceIsValid, logMessageIsValid, ILogEvent, LogLevel } from './';

describe('Functions: namespaceIsValid', () => {
    it('namespaceIsValid(null) returns false ...', () => {
        var actual = namespaceIsValid(null);
        expect(actual).toBeFalsy();
    });

    it('namespaceIsValid("") returns false ...', () => {
        var actual = namespaceIsValid('');
        expect(actual).toBeFalsy();
    });

    it('namespaceIsValid("test:asdfasdf:adsfasdf") returns true ...', () => {
        var actual = namespaceIsValid('test:asdfasdf:adsfasdf');
        expect(actual).toBeTruthy();
    });

    it('namespaceIsValid("test:*") returns true ...', () => {
        var actual = namespaceIsValid('test:*');
        expect(actual).toBeTruthy();
    });

    it('namespaceIsValid("test*") returns true ...', () => {
        var actual = namespaceIsValid('test*');
        expect(actual).toBeTruthy();
    });

});

describe('Functions: logMessageIsValid', () => {
    it('logMessageIsValid(null) returns false ...', () => {
        var actual = logMessageIsValid(null);
        expect(actual).toBeFalsy();
    });

    it('logMessageIsValid("") returns true ...', () => {
        var actual = logMessageIsValid('');
        expect(actual).toBeTruthy();
    });

});