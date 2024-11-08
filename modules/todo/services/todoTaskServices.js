const todoDao = require('../dao/taskDao');
const logging = require('../../../logging/logging');
const dbHandler = require("../../../database/mysqllib");
const checker = require("../../register/dao/registerDao");

exports.getTasks = async(apiReference, opts)=>{

    let response = {success:false};
    
    let getResponse = await todoDao.getTasks(apiReference, opts);
    // if the obj returned by dao did'nt contain success key or success was false then the operation failed

    if (!getResponse.success){
        return getResponse;
    }
    

    logging.log(apiReference, {event:'GetTasks',RESPONSE:getResponse});
    response.success = true;
    response.data = getResponse;
    return response;
}

exports.createTask = async(apiReference, values)=>{
    let response = {success:false};
    logging.log(apiReference,{ EVENT : "CREATE TASK SERVICE", values});

    let getResponse = await todoDao.createTask(apiReference, values);

    if(!getResponse.success){
        return response;
    }

    response.success = true;
    response.data = `Added Sucessfully`;
    return response;
};

exports.deleteTask = async(apiReference, opts)=>{
    let response = {success: false};
    logging.log(apiReference, {EVENT: "Delete Task Service", opts});

    // check if the task even exists
    let whereOpts = {};
    
    let taskExists = await todoDao.taskExists(apiReference, opts);

    if(!taskExists.success){
        response.error = taskExists.error;
        return response;
    }
    
    let getResponse = await todoDao.deleteTask(apiReference, opts);

    if(!getResponse.success){
        response.error = getResponse.error;
        return response;
    }

    response.success = true;
    response.data = 'Deleted Successfully';
    return response
}

exports.updateTask = async(apiReference, opts)=>{
    let response = {success: false};

    logging.log(apiReference, {EVENT:"Update Task Service"}, opts);

    // check if the task even exists
    let whereOpts = {};
    if(opts.hasOwnProperty('_id') ){
        whereOpts._id = opts._id;
    }
    if(opts.hasOwnProperty('id')){
        whereOpts.id = opts.id;
    }
    if(opts.hasOwnProperty('user_id')){
        whereOpts.user_id = opts.user_id
    }
    
    let taskExists = await todoDao.taskExists(apiReference, whereOpts);

    if(!taskExists.success){
        response.error = taskExists.error;
        return response;
    }
    
    let getResponse = await todoDao.updateTask(apiReference, opts)  ;

    if (!getResponse.success){
        response.error = getResponse.error;
        return response;
    }

    response.success = true;
    response.data = 'Updation successful';

    return response;
}

