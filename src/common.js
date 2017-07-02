"use strict";

const log4js = require('log4js');

exports.logger = function (config) {
    const logger = log4js.getLogger();
    if (config.log4js.level) logger.setLevel(config.log4js.level);
    return logger;
};
