'use strict';

require('js-yaml');
require("./config/default.yml");

import config from 'config';
import Common from "./src/common";
import enavi from "./src/enavi";

const async = require('async');
const logger = Common.logger;

export const enaviTask = (event, context, callback) => {
  const response = new Response();

  async.waterfall([(callbackAsync) =>
    {
      logger.info("Merge request config");
      const extendConfig = config.util.extendDeep(
        config.util.cloneDeep(config),
        JSON.parse(event.body)
      );

      if (extendConfig.has('log4js.level')) logger.setLevel(extendConfig.get('log4js.level'));
      logger.info(`event: ${JSON.stringify(event)}`);
      logger.info(`context: ${JSON.stringify(context)}`);

      callbackAsync(null, extendConfig);
    },
    enavi.main

  ], (error, results) => {
    logger.info(`result = ${JSON.stringify(results)}`);

    if (error) {
      response.statusCode = 500;
      response.body = JSON.stringify(error);

    } else {
      response.statusCode = 202;
      response.body = JSON.stringify(results);
    }

    logger.info(`response = ${JSON.stringify(response)}`);
    callback(error, response);
  });
  loopSleep(15, 1000, i => {
    logger.info(`loopSleep = ${i}`);
  });
}

class Response{
  constructor(){
    this.statusCode = 200;
    this.headers = {
      "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
    };
    this.body = "{}";
  }
}

function loopSleep(_loopLimit,_interval, _mainFunc){
  var loopLimit = _loopLimit;
  var interval = _interval;
  var mainFunc = _mainFunc;
  var i = 0;
  var loopFunc = function () {
    var result = mainFunc(i);
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
