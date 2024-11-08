const todoDao = require("../dao/adminTaskDao");
const logging = require("../../../logging/logging");


exports.createTask = async(apiReference, opts)=>{
    let response = {success: false};
    logging.log(apiReference, {EVENT: "Inside createTask Service Admin", OPTS:opts});

    // check whether the user_id exists in users

    let userExists = await todoDao.userExists(apiReference, opts);
    if(!userExists.success){
        response.error = userExists.error;
        return response;
    }

    let getResponse = await todoDao.createTask(apiReference, opts);
    if(!getResponse.success){
        response.error = getResponse.error;
        return response;
    }

    response.success = true;
    response.data = getResponse.data;
    return response
}

exports.getTasks = async(apiReference, opts)=>{
    let response = {success: false};
    logging.log(apiReference, {EVENT: "Inside admin service getTasks", OPTS: opts});
    let getResponse = await todoDao.getTasks(apiReference, opts);
    if(!getResponse.success){
        response.error = getResponse.error;
        return response;
    }

    response.success = true;
    response.data = getResponse.data;
    return response;
}

exports.deleteTask= async(apiReference, opts)=>{
    let response = {success: false};
    logging.log(apiReference, {EVENT: "Inside admin service DeleteTask", OPTS: opts});

    // Checking if user_id is valid
    let userExists = await todoDao.userExists(apiReference, opts);
    if(!userExists.success){
        response.error = userExists.error;
        return response;
    }

    let getResponse = await todoDao.deleteTask(apiReference, opts);
    if(!getResponse.success){
        response.error = getResponse.error;
        return response;
    }

    response.success = true;
    response.data = getResponse.data;
    return response;

}

exports.updateTask = async(apiReference, opts)=>{
    let response = {success: false};
    logging.log(apiReference, {EVENT: "Inside admin service updateTask", OPTS: opts});

    // Checking if user_id is valid
    let userExists = await todoDao.userExists(apiReference, opts);
    if(!userExists.success){
        response.error = userExists.error;
        return response;
    }


    let getResponse = await todoDao.updateTask(apiReference, opts);
    if(!getResponse.success){
        response.error = getResponse.error;
        return response;
    }

    response.success = true;
    response.data = getResponse.data;
    return response;

}