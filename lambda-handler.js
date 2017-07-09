'use strict';

require('js-yaml');
require("./config/default.yml");

import config from 'config';
import Common from "./src/common";
import enavi from "./src/enavi";

// const async = require('async');
const logger = Common.logger;

export const enaviTask = (event, context, callback) => {
  const response = new Response();

  logger.info("Merge request config");
  const extendConfig = config.util.extendDeep(
    config.util.cloneDeep(config),
    JSON.parse(event.body)
  );

  if (extendConfig.has('log4js.level')) logger.setLevel(extendConfig.get('log4js.level'));
  logger.info(`event: ${JSON.stringify(event)}`);
  logger.info(`context: ${JSON.stringify(context)}`);

  const promise = Promise.resolve(["getTimes"]) //TODO:
    .then(tasks => {
      return enavi.main(tasks, extendConfig)
    })
    .then(result => {
      logger.info(`result = ${JSON.stringify(result)}`);
      response.statusCode = 202;
      response.body = JSON.stringify(result);

      logger.info(`response = ${JSON.stringify(response)}`);
      callback(null, response);
    })
    .catch(error => {
      logger.error(error);
      response.statusCode = 500;
      response.body = JSON.stringify(error);

      logger.info(`response = ${JSON.stringify(response)}`);
      callback(error, response);
    });
/*
  async.waterfall([
    (callbackAsync) => {
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
    (extendConfig, callbackAsync) => {
      const tasks = ["getTimes"]; //TODO:
      enavi.main(tasks, extendConfig)
        .then(result => callbackAsync(null, result))
        .catch(err => callbackAsync(err));
    }
  ], (error, results) => {
    if (error) {
      logger.error(error);
      response.statusCode = 500;
      response.body = JSON.stringify(error);

    } else {
      logger.info(`result = ${JSON.stringify(results)}`);
      response.statusCode = 202;
      response.body = JSON.stringify(results);
    }

    logger.info(`response = ${JSON.stringify(response)}`);
    callback(error, response);
  });
*/
  // Lambdaではメインプロセスが終了すると子プロセスも全てKillされる為、
  // メイン処理完了まで本プロセスをブロッキングする。
  let loop = true;
  promise.then(() => { loop = false })
  Common.loopSleep(context.getRemainingTimeInMillis() / 1000, 1000, i => {
    logger.info(`loopSleep = ${i}`);
    return loop;
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



var https = require ('https');
exports.enaviTask2 = function(event, context) {
    https.get(JSON.parse(event.body).enavi.loginUrl, function(res) {
        console.log("Got response: " + res.statusCode);

        res.on("data", function(chunk) {
            context.done(null, chunk);
        });
    }).on('error', function(e) {
        context.done('error', e);
    });
};
