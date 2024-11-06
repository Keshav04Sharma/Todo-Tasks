// The purpose of this file is to serve as the entrypoint for the initialization of server and the database connection
'use strict';
const serverService = require('../services/startServer');
const database = require('../database/index');
const envProperties = require("../properties/envProperties");
const apiReferenceModule = {
    module : "startup",
    api : "initialize"
}
const logging = require('../logging/logging');
const properties = require('../database/dbProperties');

const initializeServer = async ()=>{

    // try to initialize the server and db
    try{
        await serverService.startServer(envProperties.PORT);
        await database.initializeDb(apiReferenceModule);
        
    }
    catch(error){
        logging.logError(apiReferenceModule, {event: 'initializing server and db', error:'server startup failed'});
        throw new Error(error)

    }
};
exports.initializeServer = initializeServer;

