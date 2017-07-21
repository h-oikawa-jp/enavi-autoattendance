"use strict";

import Common from "./common";
import Task from "./task";

// Parse command line options
const program = require("commander");
program
    .version('0.1.2')
    .usage(`tasks... [options]  =>   tasks = [ ${Object.keys(Task).filter((v) => v != 'login').join(", ")} ] (separate with space) `)
    .option('-s, --show', 'Flag of Showing GUI window')
    .option('-e, --env <env>', 'An Environment String (Load config file from [config/{env}.ext])')
    .parse(process.argv);

// Task arguments check
const tasks = program.args;
const invalidArgs = tasks.filter(t => !Object.keys(Task).includes(t));
if (invalidArgs.length !== 0)
    throw new Error(`Invalid args found => [${invalidArgs}] : Available tasks = [${Object.keys(Task)}]`);


// Environment setting
if (program.hasOwnProperty("env"))
    process.env.NODE_ENV = program.env;


// Load config files, and override by cmd options
const config = require('config');
if (program.hasOwnProperty("show"))
    config.nightmare.show = program.show;


// Logger
const logger = Common.logger(config);

logger.info('Configuration Env: ' + config.util.getEnv('NODE_ENV'));
logger.info(config);
logger.debug(program);


/** Nightmare module */
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: config.nightmare.show });
logger.debug(`Nightmare options: ${JSON.stringify(nightmare.options)}`);


///////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Run main tasks processes (in sequential)
 */
const co = require('co');
co(function *(){
    const topUrl = onSuccess('login: ', yield Task.login(nightmare, config));

    let result;
    for (const task of tasks) {
        let promise;
        switch (task) {
            case 'workStart': promise = Task.workStart(nightmare, topUrl); break;
            case 'workEnd': promise = Task.workEnd(nightmare, topUrl); break;
            case 'approvalRequest': promise = Task.approvalRequest(nightmare, topUrl, config); break;
            case 'getTimes': promise = Task.getTimes(nightmare, topUrl); break;
            case 'logout': promise = Task.logout(nightmare); break;
            default : throw new Error(`Undefined task: [${task}]`);
        }
        result = onSuccess(`${task}: `, yield promise );
    }

    return result;
}).catch(onError);

function onSuccess(message, result) {
    logger.info(message, result);
    return result;
}

function onError(err) {
    logger.error(err);
    nightmare.halt(err, logger.warn("Nightmare is halted"));
    return err;
}
