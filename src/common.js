"use strict";

const log4js = require('log4js');

exports.logger = log4js.getLogger();

exports.loopSleep = (_loopLimit,_interval, _mainFunc) => {
    const loopLimit = _loopLimit;
    const interval = _interval;
    const mainFunc = _mainFunc;
    let i = 0;
    const loopFunc = function () {
        const result = mainFunc(i);
        if (result === false) {
            // break機能
            return;
        }
        i = i + 1;
        if (i < loopLimit) {
            setTimeout(loopFunc, interval);
        }
    }
    loopFunc();
}

exports.createCurry = (func) => {
    const slice = Array.prototype.slice,
        stored_args = slice.call(arguments, 1);

    return function(){
        var new_args = slice.call(arguments);
        args = stored_args.concat(new_args);
        return func.apply(null, args);
    };
}
