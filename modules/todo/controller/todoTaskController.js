"use strict";

const todoService = require('../services/todoTaskServices');
const responses = require('../../../responses/responses');
const logging = require('../../../logging/logging');

exports.getTasks = async(req, res, next)=>{

    let apiReference = req.apiReference;
    let {user_id} = res.locals.auth_details;

    try{
        let queryParams = {...req.query, user_id};

        let response = await todoService.getTasks(apiReference,queryParams);

        // returned object has a success key if it was successful
        if(response.success){
            return responses.success(res, response.data);
        }
        
        return responses.failure(res,response.error);
    }
    catch(error){
        logging.logError(apiReference, {task:'getting the Task list', status:'failed'});
    }
};

exports.createTask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    let {user_id} = res.locals.auth_details;

    try{
        const reqBody = {...req.body,user_id};
        const response = await todoService.createTask(apiReference, reqBody);

        if(response.success){
            return responses.success(res, response.data);
        }
        return responses.failure(res, response.error);
    }
    catch(error){
        logging.logError(apiReference, {task:'creating the Task', status:'failed'});
        return responses.failure(res,"some error occoured")
    }
}


exports.deleteTask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    let {user_id} = res.locals.auth_details;

    try{
        const reqBody = {...req.body,user_id};

        const response = await todoService.deleteTask(apiReference, reqBody);
        if(response.success){
            return responses.success(res, response.data);
        }
        else if (response.error){
            return responses.failure(res, response.error)
        }

    }
    catch(error){
        logging.logError(apiReference, {EVENT:'Deleting the Task', status:'failed'});
        return responses.failure(res,"some error occoured");
    }
}



exports.updateTask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    let {user_id, role} = res.locals.auth_details;


    try{
        const reqBody = {...req.body, user_id, role};

        const response = await todoService.updateTask(apiReference, reqBody);

        if(response.success){
            return responses.success(res, response.data);
        }
        else if(response.error){
            return responses.failure(res, response.error);
        }

    }

    catch(error){
        logging.logError(apiReference, {EVENT:'TodoController update', status:'Failed'} );
        return responses.failure(res,"Updation Failed");
    }
}