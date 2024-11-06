// this file serves as entrypoint for the database connection
require('config');

const dbProperties = require('./dbProperties');
const mysqllib = require('./mysqllib');
const redislib = require('./redislib');
const mongolib = require('./mongolib');

async function initializeDb(apiReference){
    
    if (dbProperties.selectedDb === 'mongo'){
        global.mongoConn = await  mongolib.mongoConnect(apiReference, dbProperties.mongo.master);

    }
    else{
        global.mysqlConn =  await mysqllib.initialize(apiReference, dbProperties.mysql.master);

    }

    global.redisConn = await redislib.initialize(apiReference, dbProperties.redis.master);

}

exports.initializeDb = initializeDb;