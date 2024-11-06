const logging = require("../../../logging/logging");
const jwtService = require("../../../services/jwtService");
const redisService = require('../../../database/redislib');
const dbProperties = require("../../../database/dbProperties");

exports.setUpJwtToken = async (apiReference, opts) => {
    logging.log(apiReference, { EVENT: "Login Token Service", data: opts });

    const time = "10 days";

    const accessToken = await jwtService.createJwt(apiReference, opts, time);
    console.log(opts);
    let user_id ;
    if(dbProperties.selectedDb === 'mongo'){
        user_id = opts._id;
    }
    else{
        user_id = opts.user_id;
    }
    await module.exports.saveToCache(apiReference, user_id, accessToken);

    return accessToken;
}

// util function to cache the token into redis

exports.saveToCache = async (apiReference, key, val) => {
    let result = await redisService.set(apiReference, key, val);
    logging.log(apiReference, { EVENT: "Saving token to redis Cache" });
    return result
}