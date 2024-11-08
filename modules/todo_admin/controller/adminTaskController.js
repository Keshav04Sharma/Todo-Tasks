const logging = require("../../../logging/logging");
const responses = require("../../../responses/responses");
const todoService = require("../services/adminTaskService");

exports.createTask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    try{
        const reqBody = {...req.body};
        const response = await todoService.createTask(apiReference, reqBody);

        
        if(response.success){
            return responses.success(res, response.data);
        }
        else{
            return responses.failure(res, response.error);
        }
    }
    catch(error){
        logging.logError(apiReference, {task:'creating the Task', status:'failed'});
        return responses.failure(res,"some error occoured")
    }
}

exports.getTasks = async(req, res, next)=>{
    let apiReference = req.apiReference;
    try{
        const reqBody = req.query;
        logging.log(apiReference, {EVENT: "Inside admin getTask Controller", OPTS:reqBody});
        const response = await todoService.getTasks(apiReference, reqBody);
        // returned object has a success key if it was successful
        if(response.success){
            return responses.success(res, response.data);
        }
        else{
            return responses.failure(res,response.error);
        }
    }
    catch(error){
        logging.logError(apiReference, {task:'getting the Task list', status:'failed'});
        return responses.failure(res,error.message);
    }
}

exports.updateTask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    try{
        const reqBody = req.body;
        logging.log(apiReference, {EVENT: "Inside admin updateTask controller", OPTS: reqBody});
        const response = await todoService.updateTask(apiReference, reqBody);

        // If there was no success
        if(response.success){
            return responses.success(res, response.data);
        }
        else{
            return responses.failure(res,response.error);
        }
    }
    catch(error){
        return responses.failure(res,error.message);
    }
}


exports.deleteTask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    try{
        const reqBody = req.body;
        logging.log(apiReference, {EVENT:"Inside admin deleteTask controller", OPTS:reqBody});

        const response = await todoService.deleteTask(apiReference, reqBody);

        if(response.success){
            return responses.success(res, response.data);
        }
        else{
            return responses.failure(res, response.error)
        }
    }
    catch(error){
        return responses.failure(res,error.message);
    }
}
