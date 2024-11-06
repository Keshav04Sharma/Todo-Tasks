const mysql = require('mysql2');
const logging = require('../logging/logging');
const config = require('config')
const properties = require('./dbProperties');

const initialize = async(apiReference, config)=>{
    // check the connections taken from the pool
    let numConnectionPool = 0;
    // Log the event
    console.log(apiReference,config,'****************');
    logging.log(apiReference, 'Starting the mysql Db connection.');

    let conn = mysql.createPool(config).promise();

    // callback for successful connection 
    conn.on('connection', function (){
        console.log('Successfully connected');
        numConnectionPool++;
        logging.log(apiReference,{ EVENT : "CONNECTED TO DB SUCCESSFULL", numConnectionPool})
    });

    // callback for failure
    conn.on('error', function(){
        logging.logError(apiReference, {event: 'connecting to db', error: 'connection failed'});
        return initialize(apiReference, config);
    });
    return conn
};

const executeQuery = async (apiReference, event, qry, params)=>{
    // store the whole sql query in a variable for logging
    let sqlQuery = mysqlConn.format(qry, params);
    logging.log(apiReference,{ EVENT : "QUERY ",sqlQuery });

    try{
        let queryResult = await mysqlConn.query(qry, params);
        logging.log(apiReference, { EVENT     : "Executing query " + event, QUERY: sqlQuery,
            SQL_RESULT: queryResult[0], SQL_RESULT_LENGTH: queryResult[0]?.length});
    
            return queryResult[0];
        }
        catch(sqlError){
            console.log(sqlError);
            logging.logError(apiReference, {EVENT: " Error in executing while " + event, SQL_ERROR: sqlError, QUERY: sqlQuery});
    
            // If a deadlock or query interruption error occurs, retry the query after a delay.
            if (sqlError.code === 'ER_LOCK_DEADLOCK' || sqlError.code === 'ER_QUERY_INTERRUPTED') {
                setTimeout(executeQuery.bind(null, apiReference, event, qry, params), 50);
            }
            else if (sqlError.code == "ER_DUP_ENTRY") {
                // consoling duplicate entry
                return {
                success: false,
                ERROR: "ER_DUP_ENTRY"
                }
            } 
            else {
                // return object to the console.
                return {success: false, ERROR: sqlError.message, QUERY: queryString, PARAMS: params, EVENT: event};
            }
        }
    
};

exports.initialize                  = initialize;
exports.executeQuery                = executeQuery;