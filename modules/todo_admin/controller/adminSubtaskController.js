const logging = require("../../../logging/logging");
const responses = require("../../../responses/responses");
const todoService = require("../services/adminSubtaskService");

exports.createSubtask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    try{
        let reqBody = req.body;
        logging.log(apiReference, {EVENT: "Inside admin controller create Subtask", OPTS:reqBody});
        let response = await todoService.createSubtask(apiReference, reqBody)

        if(response.success){
            return responses.success(res, response.data, "Creation done");
        }
        else{
            return responses.failure(res, response.error)
        }
    }
    catch(error){
        return responses.failure(res, error.message);
    }
}

exports.getSubtasks = async(req, res , next)=>{
    let apiReference = req.apiReference;
    try{
        let reqBody = req.query;
        logging.log(apiReference, {EVENT: "inside admin controller get subtasks", OPTS:reqBody});

        let response = await todoService.getSubtasks(apiReference, reqBody);

        if(response.success){
            return responses.success(res, response.data);
        }
        else{
            return responses.failure(res, response.error)
        }
    }catch(error){
        return responses.failure(res, error.message);
    }
}

exports.updateSubtask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    try{
        let reqBody = req.body;
        logging.log(apiReference, {EVENT: "Inside admin controller update Subtask", OPTS: reqBody});

        let response = await todoService.updateSubtask(apiReference, reqBody);

        if(response.success){
            return responses.success(res, response.data);
        }
        else{
            return responses.failure(res, response.error);
        }
    }catch(error){
        return responses.failure(res, error.message);
    }
}

exports.deleteSubtask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    try{
        let reqBody = req.body;
        logging.log(apiReference, {EVENT: "inside admin controller deleteSubtask"})

        let response = await todoService.deleteSubtask(apiReference, reqBody);

        if(response.success){
            return responses.success(res, response.data)
        }
        else{
            return responses.failure(res, response.error);
        }
    }catch(error){
        return responses.failure(res, error.message);
    }
}