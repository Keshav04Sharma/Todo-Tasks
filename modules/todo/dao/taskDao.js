const dbHandler = require('../../../database/mysqllib');
const logging = require('../../../logging/logging');
const constants = require('../../../responses/responseConstants');
const dbProperties = require("../../../database/dbProperties");
const tasks = require("../../models/taskModel");
const { where } = require('underscore');
// Task DAO Functions

exports.getTasks = async (apiReference, opts) => {

    let response = { success: false };
    let queryResponse;

    if (dbProperties.selectedDb === 'mongo') {
        queryResponse = await tasks.find({ ...opts, is_deleted: 0 });

        if (_.isEmpty(queryResponse)) {
            response.error = "No such task is active or exists";
            return response;
        }
        response.success = true;
        response.data = queryResponse;
        return response;
    }
    else {

        let query = `SELECT * FROM tasks WHERE is_deleted = 0 and user_id = ? ORDER BY id LIMIT ? OFFSET ?`;
        const val = [parseFloat(opts.user_id), parseFloat(opts.limit), parseFloat(opts.offset)];


        queryResponse = await dbHandler.executeQuery(apiReference, 'getTasks', query, val);
        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }
        else if (_.isEmpty(queryResponse)) {
            response.error = "No active tasks for the user";
            return response
        }
        response.success = true;
        response.data = queryResponse;
    }
    return response;
}



exports.createTask = async (apiReference, opts) => {
    let response = { success: false };
    let queryResponse;

    logging.log(apiReference, { EVENT: "CREATE TASK DAO", opts })

    if (dbProperties.selectedDb === 'mongo') {
        try {
            queryResponse = await tasks.create(opts);
            if(_.isEmpty(queryResponse)){
                response.error = "no active task for specified user";
                return response;
            }
            response.success = true;
            response.data = queryResponse;
            return response;
        } catch (err) {
            console.log(err);
            response.error = err;
            logging.logError(apiReference, { EVENT: "Error was-->", ERR: err });
            return response;
        }
    }

    else {
        const qry = `INSERT INTO tasks SET ?`;
        const val = [opts];

        queryResponse = await dbHandler.executeQuery(apiReference, 'createTask', qry, val);
        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }

        response.success = true;
        response.data = queryResponse;
        return response;
    }
    
}

exports.deleteTask = async (apiReference, opts) => {
    let response = { success: false };
    let queryResponse;

    if (dbProperties.selectedDb === 'mongo') {
        try {
            queryResponse = await tasks.updateOne(opts, { $set: { is_deleted: 1 } });

            if (queryResponse.modifiedCount === 0) {
                response.error = "No such task is active or exists";
                return response
            }

            response.success = true;
            response.data = queryResponse;
            return response
        }
        catch (err) {
            response.error = err;
            return response
        }

    }

    else {

        let query = "UPDATE tasks SET is_deleted = 1 WHERE ";
        const val = [];
        if (opts.hasOwnProperty('user_id')) {
            query += "user_id = ? ";
            val.push(opts.user_id);

        }

        if (opts.hasOwnProperty('task')) {
            query += "AND task = ? ";
            val.push(opts.task);
        }

        if (opts.hasOwnProperty('id')) {
            query += " AND id = ? ";
            val.push(opts.id);
        }

        queryResponse = await dbHandler.executeQuery(apiReference, 'deleteTask', query, val);
        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }

        response.success = true;
        response.data = queryResponse;
    }

    return response;
}


exports.updateTask = async (apiReference, opts) => {
    logging.log(apiReference, { EVENT: 'Updation task DAO', opts });
    let queryResponse;
    let response = { success: false };


    if(dbProperties.selectedDb === 'mongo'){
        try{

            let whereOpts = {}

            if(opts.hasOwnProperty('_id')){
                whereOpts._id = opts._id;
            }
            if(opts.hasOwnProperty('user_id')){
                whereOpts.user_id = opts.user_id;
            }

            queryResponse = await tasks.updateOne(whereOpts, opts);

            if (queryResponse.modifiedCount === 0){
                response.error= "Updation was unsuccessful. Either the task is deleted or does'nt exist";
                return response;
            }

            response.success = true;
            response.data = queryResponse;
            return response;
            
        }catch(err){
            response.error = err;
            return response
        }

    }
    
    else{
        let query = `UPDATE tasks SET ? WHERE `;
        const val = [opts];

        if (opts.hasOwnProperty('user_id')) {
            query += 'user_id = ? ';
            val.push(opts.user_id);
        }

        if (opts.hasOwnProperty('id')) {
            query += 'AND id = ?';
            val.push(opts.id);
        }

        queryResponse = await dbHandler.executeQuery(apiReference, 'updateTask', query, val);
        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }
        if (_.isEmpty(queryResponse)) {
            response.error = "Task updation failed. No such active task";
            return response
        }

        response.success = true;
        response.data = queryResponse;
    }
    return response;
}

exports.taskExists = async (apiReference, opts) => {
    logging.log(apiReference, { EVENT: "Inside task Dao taskExists", OPTS: opts });

    let response = {
        success: false
    };
    let queryResponse;

    if (dbProperties.selectedDb === 'mongo') {
        try {
            let whereOpts = {}

            if(opts.hasOwnProperty('_id')){
                whereOpts._id = opts._id;
            }
            if(opts.hasOwnProperty('user_id')){
                whereOpts.user_id = opts.user_id;
            }
            if(opts.hasOwnProperty('task')){
                whereOpts.task = opts.task;
            }
            if(opts.task_id){
                whereOpts._id = opts.task_id;
            }
            queryResponse = await tasks.find({...whereOpts,is_deleted:0});

            if (_.isEmpty(queryResponse)) {
                response.error = "No such task is active or exists";
                return response
            }

            response.success = true;
            response.data = queryResponse;
            return response
        }
        catch (err) {
            response.error = err.message;
            return response
        }
    }

    else {
        let val = []
        let query = 'SELECT * FROM tasks WHERE is_deleted = 0';
        if (opts.hasOwnProperty("user_id")) {
            query += " AND user_id = ? ";
            val.push(opts.user_id);
        }

        if (opts.hasOwnProperty('id')) {
            query += " AND id = ?";
            val.push(opts.id)
        }

        if (opts.hasOwnProperty('task')) {
            query += " AND task = ?";
            val.push(opts.task)
        }

        queryResponse = await dbHandler.executeQuery(apiReference, 'Checking for task', query, val);

        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }

        if (_.isEmpty(queryResponse)) {
            response.error = "No Such active task";
            return response
        }

        response.success = true;
        response.data = queryResponse;
    }

    return response;
}



