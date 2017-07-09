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

// Task arguments check
const tasks = program.args;

// Environment setting
if (program.hasOwnProperty("env"))
    process.env.NODE_ENV = program.env;

// Load config files, and override by cmd options
const config = require('config');
if (program.hasOwnProperty("show"))
    config.nightmare.show = program.show;

const logger = Common.logger;

// Nightmare module
const Nightmare = require('nightmare');

///////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Run main tasks processes (in sequential)
 */
async function main(config) {
    if (config.has('log4js.level')) logger.setLevel(config.get('log4js.level'));

    logger.info('Configuration Env: ' + config.util.getEnv('NODE_ENV'));
    logger.info(config);
    logger.debug(program);

    let result;
    const nightmare = Nightmare(config.nightmare);
    try {
        logger.debug(`Nightmare options: ${JSON.stringify(nightmare.options)}`);

        const topUrl = onSuccess('login: ', await Task.login(nightmare, config));

        for (const task of tasks) {
            let promise;
            switch (task) {
                case 'workStart': promise = Task.workStart(nightmare, topUrl); break;
                case 'workEnd': promise = Task.workEnd(nightmare, topUrl); break;
                case 'approvalRequest': promise = Task.approvalRequest(nightmare, topUrl); break;
                case 'getTimes': promise = Task.getTimes(nightmare, topUrl); break;
                default : throw new Error(`Undefined task: [${task}]`);
            }
            result = onSuccess(`${task}: `, await promise );
        }

        onSuccess('logout: ', await Task.logout(nightmare));
    } catch (error) {
        result = onError(error);
        nightmare.halt(error, logger.warn("Nightmare is halted"));
    }
    return result;
}

function onSuccess(message, result) {
    logger.info(message, result);
    return result;
}

function onError(err) {
    logger.error(err);
    return err;
}

exports.main = main;
