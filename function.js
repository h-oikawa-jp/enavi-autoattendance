'use strict';

require('js-yaml');
require("./config/default.yml");

import config from 'config';
import Common from "./src/common";
import enavi from "./src/enavi";

// const async = require('async');
const logger = Common.logger;

exports.enaviTask = (request, response) => {
  const extendConfig = config.util.extendDeep(
    config.util.cloneDeep(config),
    {}//JSON.parse(request.body.config)
  );

  if (extendConfig.has('log4js.level')) logger.setLevel(extendConfig.get('log4js.level'));
  // logger.info(`request: ${JSON.stringify(request)}`);

  const promise = Promise.resolve(["getTimes"]) //TODO:
    .then(tasks => {
      return enavi.main(tasks, extendConfig)
    })
    .then(result => {
      logger.info(`result = ${JSON.stringify(result)}`);
      const statusCode = 202;
      const body = JSON.stringify(result);

      logger.info(`responseBody = ${body}`);
      response.status(statusCode).send(body);
    })
    .catch(error => {
      const statusCode = 500;
      const body = JSON.stringify(error);

      logger.error(error);
      response.status(statusCode).send(body);
    });
  // Lambdaではメインプロセスが終了すると子プロセスも全てKillされる為、
  // メイン処理完了まで本プロセスをブロッキングする。
  let loop = true;
  promise.then(() => { loop = false })
  Common.loopSleep(20000, 1000, i => {
    logger.info(`loopSleep = ${i}`);
    return loop;
  });
}
