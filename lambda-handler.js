'use strict';

require('js-yaml');
require("./config/default.yml");

import config from 'config';
import Common from "./src/common";
import enavi from "./src/enavi";

const logger = Common.logger;

var binaryPack = require('./lib/bootstrap/nightmare-lambda-pack');
var Xvfb = require('./lib/bootstrap/xvfb');

var isOnLambda = binaryPack.isRunningOnLambdaEnvironment;
var electronPath = binaryPack.installNightmareOnLambdaEnvironment();

exports.handler = (event, context) => {
  var xvfb = new Xvfb({
    xvfb_executable: '/tmp/pck/Xvfb',  // Xvfb executable will be at this path when unpacked from nigthmare-lambda-pack
    dry_run: !isOnLambda         // in local environment execute callback of .start() without actual execution of Xvfb (for running in dev environment)
  });

  xvfb.start((err, xvfbProcess) => {
    if (err) context.done(err);

    function done(err, result){
      xvfb.stop((err) =>{
        context.done(err, result);
      });
    }

    enaviTask(event, context, done);

  });
};


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



// var https = require ('https');
// exports.enaviTask2 = function(event, context) {
//     https.get(JSON.parse(event.body).enavi.loginUrl, function(res) {
//         console.log("Got response: " + res.statusCode);

//         res.on("data", function(chunk) {
//             context.done(null, chunk);
//         });
//     }).on('error', function(e) {
//         context.done('error', e);
//     });
// };
