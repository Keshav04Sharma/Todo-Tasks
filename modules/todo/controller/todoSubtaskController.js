const todoService = require('../services/todoSubtaskServices');
const responses = require('../../../responses/responses');
const logging = require('../../../logging/logging');

exports.getSubtasks = async(req, res, next)=>{

    let apiReference = req.apiReference;
    let {user_id} = res.locals.auth_details;

    try{

        let queryParams = {...req.query, user_id};
        // Check if there are any subtasks
        let response = await todoService.getSubtasks(apiReference,queryParams);

        // returned object has a success key if it was successful
        if(response.success){
            return responses.success(res, response.data);
        }
        return responses.failure(res,response.error);
    }
    catch(error){

        responses.failure(apiReference,error)
        logging.logError(apiReference, {task:'getting the SubTask list', status:'failed'});
    }
};


exports.createSubtask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    let {user_id} = res.locals.auth_details;

    logging.log(apiReference, {EVENT:"Create subtask controller"});
    try{
        const reqBody = {...req.body, user_id};

        const response = await todoService.createSubtask(apiReference, reqBody);

        if(response.success){
            return responses.success(res, response.data);
        }
        if(response.error){
            return responses.failure(res, response.error)
        }
        return responses.failure(res, response.error);
    }
    
    catch(error){
        logging.logError(apiReference, {task:'creating the SubTask', status:'failed'});
        return responses.failure(res,"some error occoured")
    }
}


exports.deleteSubtask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    let {user_id} = res.locals.auth_details;

    try{
        const reqBody = {...req.body, user_id};

        const response = await todoService.deleteSubtask(apiReference, reqBody);
        if(response.success){
            return responses.success(res, response.data);
        }
        else if(response.error){
            return responses.failure(res, response.error);
        }

    }
    catch(error){
        logging.logError(apiReference, {EVENT:'Deleting the SubTask', status:'failed'});
        return responses.failure(res,"some error occoured");
    }
}



exports.updateSubtask = async(req, res, next)=>{
    let apiReference = req.apiReference;
    let {user_id} = res.locals.auth_details;

    try{
        const reqBody = {...req.body, user_id};

        const response = await todoService.updateSubtask(apiReference, reqBody);

        if(response.success){
            return responses.success(res, response.data);
        }
        else if(response.error){
            return responses.failure(res, response.error);
        }

    }

    catch(error){
        logging.logError(apiReference, {EVENT:'TodoSubTaskController update', status:'Failed'} );
        return responses.failure(res,"Updation Failed");
    }
}