const logging = require("../../../logging/logging");
const todoDao = require("../dao/adminSubtaskDao");
const taskDao = require("../dao/adminTaskDao");

exports.createSubtask = async(apiReference, opts)=>{
    let response = {success: false};

    logging.log(apiReference, {EVENT: "Inside admin service Create Subtask", OPTS: opts});
    // check if the user_id is valid
    let userExists = await taskDao.userExists(apiReference, opts);

    if(!userExists.success){
        response.error = userExists.error;
        return response;
    }
    let user_id = opts.user_id;
    let subtasks = opts.subtask;
    let task_id = opts.task_id;
    for(i = 0; i< subtasks.length; i++){
        let insertObj = {
            task_id : task_id,
            user_id : user_id,
            subtask : subtasks[i]
        }
        let getResponse = await todoDao.createSubtask(apiReference, insertObj);

        if(!getResponse.success){
            response.error = getResponse.error;
            return response;
        }
    }
    

    response.success = true;
    response.data = "Added successfully";
    return response
}


exports.getSubtasks = async(apiReference, opts)=>{
    let response = {success: false};
    logging.log(apiReference, {EVENT: "Inside admin service getSubTasks", OPTS: opts});

    // check if user_id is valid
    let userExists = await taskDao.userExists(apiReference, opts);
    if(!userExists.success){
        response.error = userExists.error;
        return response;
    }

    let getResponse = await todoDao.getSubtasks(apiReference, opts);
    if(!getResponse.success){
        response.error = getResponse.error;
        return response;
    }

    response.success = true;
    response.data = getResponse.data;
    return response;
}

exports.updateSubtask = async(apiReference, opts)=>{
    let response = {success: false};
    logging.log(apiReference, {EVENT: "inside admin service update Subtask"});

    // check if user_id is valid
    let userExists = await taskDao.userExists(apiReference, opts);
    if(!userExists.success){
        response.error = userExists.error;
        return response;
    }

    let getResponse = await todoDao.updateSubtask(apiReference, opts);
    if(!getResponse.success){
        response.error = getResponse.error;
        return response;
    }
    response.success = true;
    response.data = getResponse.data;
    return response

}

exports.deleteSubtask = async(apiReference, opts)=>{
    let response = {success: false};
    logging.log(apiReference, {EVENT: "inside admin service delete Subtask"});

    // check if user_id is valid
    let userExists = await taskDao.userExists(apiReference, opts);
    if(!userExists.success){
        response.error = userExists.error;
        return response;
    }

    let getResponse = await todoDao.deleteSubtask(apiReference, opts);
    if(!getResponse.success){
        response.error = getResponse.error;
        return response;
    }

    response.success = true;
    response.data = getResponse.data;
    return response;
}