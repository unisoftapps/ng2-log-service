import { ILogEvent } from './ng2-log-service';

export function namespaceIsValid(namespace: string) {
    if(namespace === null) {
        return false;
    }
    let namespaceExpression = new RegExp('^[a-zA-Z0-9\:\*]{1,}$');
    var passed = namespaceExpression.test(namespace);
    return passed;
}

export function logMessageIsValid(msg: string) {
    return (msg !== null);
}