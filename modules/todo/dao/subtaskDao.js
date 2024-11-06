const dbHandler = require('../../../database/mysqllib');
const logging = require('../../../logging/logging');
const constants = require('../../../responses/responseConstants');
const subtasks = require('../../models/subtaskModel');
const dbProperties = require("../../../database/dbProperties");
// Task DAO Functions

exports.getSubtasks = async (apiReference, opts) => {
    let response = { success: false };
    logging.log(apiReference,{ EVENT : "getting SUBTASK DAO", opts})
    let queryResponse;

    if(dbProperties.selectedDb === 'mongo'){
        try{
            queryResponse = await subtasks.find(opts)
            if(_.isEmpty(queryResponse)){
                response.error = "No Such active subtask";
                return response;
            }
            response.success = true;
            response.data = queryResponse;
            return response;

        }catch(err){
            response.error = err.message;
            return response;
        }
    }
    else{
        let query = `SELECT * FROM subtasks WHERE is_deleted = 0 `;    
        const val = []

        if (opts.hasOwnProperty("user_id")){
            query+= " AND user_id = ? ";
            val.push(opts.user_id);
        } 

        if (opts.hasOwnProperty('id')){
            query += ' AND id = ?';
            val.push(opts.id);
        }
        if( opts.task_id ){
            query += ' AND task_id = ? ';
            val.push(parseFloat(opts.task_id));
        }

        if( opts.hasOwnProperty('limit') && opts.hasOwnProperty('offset') ){
            query += 'LIMIT ? OFFSET ?';
            val.push(parseFloat(opts.limit));
            val.push(parseFloat(opts.offset));
        }


        queryResponse = await dbHandler.executeQuery(apiReference, 'getSubtasks', query, val);
        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }
        if(_.isEmpty(queryResponse)){
            response.error = "The Task Specified Does not exist. Please create that task first";
            return response
        }

        response.success = true;
        response.data = queryResponse;
        return response;
    }
}

exports.createSubtask = async (apiReference, opts) => {
    let response = { success: false };
    logging.log(apiReference,{ EVENT : "CREATE SUBTASK DAO", opts})
    let queryResponse;

    if(dbProperties.selectedDb === 'mongo'){
        try{
            queryResponse = await subtasks.create(opts);
            response.success = true;
            response.data = queryResponse;
            return response
        }catch(err){
            response.error = err;
            return response;
        }
    }

    else{
        const qry = `INSERT INTO subtasks SET ? `;
        const val = [opts];

        queryResponse = await dbHandler.executeQuery(apiReference, 'createSubTask', qry, val);
        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }
        response.success = true;
        response.data = queryResponse;
        return response;
        }
}

exports.deleteSubtask = async (apiReference, opts) => {
    let response = { success: false };
    if(dbProperties.selectedDb === 'mongo'){
        try{
            queryResponse = await subtasks.updateOne(opts, {$set:{is_deleted: 1}});

            if(queryResponse.modifiedCount === 0){
                response.error = "Updation Failed";
                return response;
            }
            response.success = true;
            response.data = queryResponse;
            return response;
        }catch(error){
            response.error = error.message;
            return response
        }
    }
    else{
        let query = 'UPDATE subtasks SET is_deleted = 1 WHERE id = ?';
        const val = [opts.id];
        if(opts.hasOwnProperty('task_id')){
            val.push(opts.task_id);
            query += " AND task_id = ? ";
        }

        if(opts.hasOwnProperty('user_id')){
            val.push(opts.user_id);
            query+= " AND user_id = ?"
        }

        logging.log(apiReference, {EVENT:'Subtask delete dao', data:opts});
        let queryResponse = await dbHandler.executeQuery(apiReference, 'deleteSubask', query, val);
        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }

        response.success = true;
        response.data = queryResponse;
        return response;
    }
}

exports.updateSubtask = async (apiReference, opts) => {
    logging.log(apiReference, { EVENT: 'Updation task DAO', opts });
    let response = { success: false };
    let queryResponse;

    if(dbProperties.selectedDb === 'mongo'){
        try{
            let whereOpts = {};
            if(opts.hasOwnProperty('_id')){
                whereOpts._id = opts._id;
            }
            if(opts.hasOwnProperty('user_id')){
                whereOpts.user_id = opts.user_id;
            }

            queryResponse = await subtasks.updateOne(whereOpts, opts);
            if(queryResponse.modifiedCount===0){
                response.error = "No rows were updated";
                return response;
            }
            response.success = true;
            response.data = queryResponse;
            return response;
        }catch(error){
            response.error = error.message;
            return response
        }
    }

    const query = `UPDATE subtasks SET ? WHERE id = ? AND user_id = ? `;
    let values = [opts, opts.id, opts.user_id]; // opts to set fields, opts.id for where condition
    

    queryResponse = await dbHandler.executeQuery(apiReference, 'updateTask', query, values);
    if (queryResponse.ERROR) {
        response.error = queryResponse.ERROR;
        return response;
    }

    response.success = true;
    response.data = queryResponse;
    return response;
}

exports.subTaskExists = async(apiReference, opts)=>{
    logging.log(apiReference, {EVENT: "Inside the subtask Exists Dao"})
    let response = {
        success: false
    };
    let queryResponse ;
    if(dbProperties.selectedDb === 'mongo'){
        try{
            let whereOpts = {}

            if(opts.hasOwnProperty('_id')){
                whereOpts._id = opts._id;
            }
            if(opts.hasOwnProperty('user_id')){
                whereOpts.user_id = opts.user_id;
            }
            if(opts.hasOwnProperty('subtask')){
                whereOpts.subtask = opts.task;
            }
            if(opts.task_id){
                whereOpts.task_id = opts.task_id;
            }

            queryResponse = await subtasks.find(whereOpts);
            // if no such task was active
            if(_.isEmpty(queryResponse)){
                response.error = "No such active subtask";
                return response;
            }
            response.success = true;
            response.data = queryResponse;
            return response


        }catch(err){
            response.error = err.message;
            return response;
        }
    }
    else{    
        let query = 'SELECT * FROM subtasks where is_deleted = 0';
        let val = [];

        if(opts.hasOwnProperty('id')){
            query += " AND id = ?";
            val.push(opts.id);
        }

        if(opts.hasOwnProperty('task_id')){
            query += " AND task_id = ?";
            val.push(opts.task_id);
        }

        if(opts.hasOwnProperty("user_id")){
            query += " AND user_id = ?";
            val.push(opts.user_id);
        }

        queryResponse = await dbHandler.executeQuery(apiReference, "Checking for subtask existence", query, val);

        if(_.isEmpty(queryResponse)){
            response.empty = true;
            return response;
        }

        response.success = true;
        response.data = queryResponse;
        return response;
    }
}

