const dbHandler = require('../../../database/mysqllib');
const logging = require('../../../logging/logging');
const constants = require('../../../responses/responseConstants');
const dbProperties = require("../../../database/dbProperties");
const tasks = require("../../models/taskModel");
const users = require("../../models/userModel");


exports.createTask = async(apiReference, opts)=>{
    let response = {
        success: false
    };
    let queryResponse;

    if(dbProperties.selectedDb === 'mongo'){
        try{
            queryResponse = await tasks.create(opts);
            response.success = true;
            response.data = queryResponse;
            return response;
        }catch(err){
            response.error = err.message;
            return response;
        }
    }
    else{
        let query = "Insert INTO tasks SET ? ";
        let val = [opts];

        queryResponse = await dbHandler.executeQuery(apiReference, 'Creating task for admin', query, val);
        if (queryResponse.ERROR) {
            response.error = queryResponse.ERROR;
            return response;
        }

        response.success = true;
        response.data = queryResponse;
        return response;
        }
}

exports.getTasks = async(apiReference, opts)=>{
    let response = {success: false};
    let queryResponse;

    if(dbProperties.selectedDb === 'mongo'){
        try{
            queryResponse = await tasks.find(opts);

            if(_.isEmpty(queryResponse)){
                response.error = 'No active task for specified user';
                return error;
            }

            response.success = true;
            response.data = queryResponse;
            return response;

        }catch(err){
            response.error = err.message;
            return response
        }
    }
    else{
        let query = "SELECT * FROM tasks WHERE is_deleted = 0 ";
        let val = [];
        logging.log(apiReference, {EVENT: 'Inside admin getTasks', OPTS: opts});

        if(opts.hasOwnProperty('id')){
            query += ' AND id = ? ';
            val.push(opts.id);
        }
        if(opts.hasOwnProperty('user_id')){
            query += ' AND user_id = ? ';
            val.push(opts.user_id)
        }

        queryResponse = await dbHandler.executeQuery(apiReference, "Fetching Tasks Admin", query, val);

        if(queryResponse.ERROR){
            response.error = queryResponse.ERROR;
            return response
        }
        if(_.isEmpty(queryResponse)){
            response.error = "No active Task for this User";
            return response;
        }
        response.success = true;
        response.data = queryResponse;
        return response;
        }
}

exports.updateTask = async(apiReference, opts)=>{
    let response = {success: false};
    let queryResponse;

    if(dbProperties.selectedDb === 'mongo'){
        try{
            let whereOpts = {};
            if(opts.hasOwnProperty('user_id')){
                whereOpts.user_id = opts.user_id;
            }
    
            if(opts.hasOwnProperty('_id')){
                whereOpts._id = opts._id;
            }
            whereOpts.is_deleted = 0;

            queryResponse = await tasks.updateOne(whereOpts,opts);

            if(queryResponse.modifiedCount === 0){
                response.error = "No such active task";
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
        let query = "UPDATE tasks SET ? WHERE is_deleted = 0";
        let val = [opts];

        if(opts.hasOwnProperty('user_id')){
            val.push(opts.user_id);
            query += ' AND user_id = ?';
        }

        if(opts.hasOwnProperty('id')){
            val.push(opts.id);
            query += ' AND id = ?'
        }

        queryResponse = await dbHandler.executeQuery(apiReference, "Updating task Dao Admin", query, val);

        if(queryResponse.ERROR){
            response.error = queryResponse.ERROR;
            return response;
        }
        if(queryResponse.affectedRows === 0){
            response.error = "No such active Task";
            return response;
        }

        response.success = true;
        response.data = queryResponse;
        return response;
    }
}

exports.deleteTask = async(apiReference, opts)=>{
    let response = {success : false};
    let queryResponse;

    if(dbProperties.selectedDb === 'mongo'){
        try{
            let whereOpts = {};
            if(opts.hasOwnProperty('user_id')){
                whereOpts.user_id = opts.user_id;
            }
    
            if(opts.hasOwnProperty('_id')){
                whereOpts._id = opts._id;
            }
            whereOpts.is_deleted = 0;

            queryResponse = await tasks.updateOne(whereOpts, {$set: {is_deleted:1}});

            if(queryResponse.modifiedCount === 0){
                response.error = "No Such task active. Deletion Failed !!!!";
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
        
        let query = "UPDATE tasks SET is_deleted = 1 WHERE is_deleted = 0";
        let val = [];

        if(opts.hasOwnProperty('id')){
            val.push(opts.id);
            query += ' AND id = ?';
        }

        if(opts.hasOwnProperty('user_id')){
            val.push(opts.user_id);
            query += " AND user_id = ?"
        }

        queryResponse = await dbHandler.executeQuery(apiReference, "Admin task Dao deleteTAsk", query, val);

        if(queryResponse.affectedRows===0){
            response.error = "No such task is currently active. Deletion Failed !!!";
            return response;
        }
        if(queryResponse.ERROR){
            response.error = queryResponse.ERROR;
            return response;
        }
        response.success = true;
        response.data = queryResponse;
        return response;
    }
}

exports.userExists = async(apiReference, opts)=>{
    let response = {success: false};
    let queryResponse;

    if(dbProperties.selectedDb === 'mongo'){
        try{
            queryResponse = await users.find({_id:opts.user_id});;

            if(queryResponse.length === 0){
                response.error = 'No active task for specified user';
                return response;
            }

            response.success = true;
            response.data = queryResponse;
            return response;

        }catch(err){
            response.error = err.message;
            return response
        }
    }
    else{
        let query = "SELECT * FROM users WHERE ";
        let val = [];

        if(opts.hasOwnProperty('user_id')){
            val.push(opts.user_id);
            query += 'user_id = ?';
        }

        queryResponse = await dbHandler.executeQuery(apiReference, "Checking for User existence admin dao", query, val);

        if(queryResponse.ERROR){
            response.error = queryResponse.ERROR;
            return response;
        }
        if(_.isEmpty(queryResponse)){
            response.error = "User not Found";
            return response;
        }

        response.success = true;
        response.data = queryResponse;
        return response;
    }
}

