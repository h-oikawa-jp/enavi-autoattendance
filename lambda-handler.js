'use strict';

require('js-yaml');
require("./config/default.yml");

import config from 'config';
import Common from "./src/common";
import enavi from "./src/enavi";

const logger = Common.logger;

export const enaviTask = async (event, context, callback) => {
  const response = new Response();
  try {
    const extendConfig = config.util.extendDeep(
      config.util.cloneDeep(config),
      JSON.parse(event.body)
    );

    const result = await enavi.main(extendConfig);
    logger.info(`result = ${JSON.stringify(result)}`);

    response.statusCode = 202;
    response.body = JSON.stringify(result);

    callback(null, response);

  } catch (error) {
    response.statusCode = 500;
    response.body = "Unknown Error";
    callback(error, response);
  }
}

class Response{
    constructor(){
        this.statusCode = 200;
        this.headers = {};
        this.body = "";
    }
}
