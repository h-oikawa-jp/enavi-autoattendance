"use strict";

import Common from "./common";
import Task from "./task";

// Parse command line options
const program = require("commander");
program
    .version('0.1.1')
    .usage(`tasks... [options]  =>   tasks = [ ${Object.keys(Task).join(", ")} ] (separate with space) `)
    .option('-s, --show', 'Flag of Showing GUI window')
    .option('-e, --env <env>', 'An Environment String (Load config file from [config/{env}.ext])')
    .parse(process.argv);

// Environment setting
if (program.hasOwnProperty("env")) process.env.NODE_ENV = program.env;

// Load config files, and override by cmd options
const config = require('config');
if (program.hasOwnProperty("show")) config.nightmare.show = program.show;

const logger = Common.logger;

// Nightmare module
const Nightmare = require('nightmare');

///////////////////////////////////////////////////////////////////////////////////////////////////

// Task arguments check
// const tasks = program.args;

/**
 * Run main tasks processes (in sequential)
 * @return Promise
 */
function main(tasks, config) {
    if (config.has('log4js.level')) logger.setLevel(config.get('log4js.level'));

    logger.info('Configuration Env: ' + config.util.getEnv('NODE_ENV'));
    logger.info(JSON.stringify(config));
    logger.debug(JSON.stringify(program));

    const nightmare = Nightmare(config.nightmare);
    logger.debug(`Nightmare options: ${JSON.stringify(nightmare.options)}`);

    ////////////////////////////////////////////////////////////////////////////
    return nightmare.goto(config.enavi.loginUrl)
        .catch(err => {
            logger.error("goto ERROR");
            logger.error(err);
        });
/*
    let topUrl, result;
    return Task.login(nightmare, config)
        .then(url => {
            topUrl = onSuccess('login: ', url);
        })
        .then(() => {
            return Promise.all(tasks.map(taskName => {
                let promise;
                switch (taskName) {
                    case 'workStart': promise = Task.workStart(nightmare, topUrl); break;
                    case 'workEnd': promise = Task.workEnd(nightmare, topUrl); break;
                    case 'approvalRequest': promise = Task.approvalRequest(nightmare, topUrl); break;
                    case 'getTimes': promise = Task.getTimes(nightmare, topUrl); break;
                    default : throw new Error(`Undefined Task Name: [${taskName}]`);
                }
                return promise.then(r => {
                    result = onSuccess(`${taskName}: `, r);
                });
            }));
        })
        .then(() => {
            return Task.logout(nightmare);
        })
        .then(r => {
            onSuccess('logout: ', r);
            return result;
        })
        .catch(err => {
            nightmare.halt(err, logger.warn("Nightmare is halted"));
            throw err;
        });
*/
}

function onSuccess(message, result) {
    logger.info(message, result);
    return result;
}


exports.main = main;
