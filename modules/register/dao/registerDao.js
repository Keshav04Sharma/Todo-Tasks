const logging = require('../../../logging/logging');
const dbHandler = require('../../../database/mysqllib');
const properties = require("../../../database/dbProperties");
const users = require("../../models/userModel");
exports.fetchDetails = async (apiReference, opts) => {
    let response = {
        success: false
    };
    let queryResponse;


    logging.log(apiReference,{ EVENT : "FETCH DETAILS DAO", OPTS : opts});

    if(properties.selectedDb === 'mongo'){
       try{ 
        queryResponse = await users.find(opts);
        response.success = true;
        response.data = queryResponse;
    }catch(err){
        console.log(err);
    }
    }
    else{    
        const query = 'SELECT * from users WHERE ?';
        const values = [opts];

        queryResponse = await dbHandler.executeQuery(apiReference, 'Fetching User Data', query, values);

        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }
        response.success = true;
        response.data = queryResponse;
    }
    
    return response;
}


exports.register = async (apiReference, opts) => {
    let response = {
        success: false
    };
    let queryResponse;

    if(properties.selectedDb === 'mongo'){
        try{
            queryResponse = await users.create(opts);
            response.success = true;
            response.data = queryResponse;
            return response;
        }catch(err){
            console.log(err);
            response.error = err.message;
            return response
        }
    }
    else{
        const query = 'INSERT INTO users SET ?';
        const values = [opts];
        logging.log(apiReference, { EVENT: "Register Dao", OPTS: opts })
        queryResponse = await dbHandler.executeQuery(apiReference, 'Fetching User Data', query, values);

        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }

        response.success = true;
        response.data = queryResponse;
    }  
    return response;

}