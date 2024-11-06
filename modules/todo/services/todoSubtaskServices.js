const todoDao = require('../dao/subtaskDao');
const taskDao = require("../dao/taskDao");
const logging = require('../../../logging/logging');
const dbConfig = require('../../../database/mysqllib');

// we get the query args as values here
exports.getSubtasks = async(apiReference, opts)=>{
    
    let response = {success:false};

    // check if provided task exists
    let task_exists = await taskDao.taskExists(apiReference,{user_id: opts.user_id, id: parseFloat(opts.task_id)});
    if(task_exists.empty){
        response.error = 'No Such Task Exists';
        return response;
    }

    let getResponse = await todoDao.getSubtasks(apiReference, opts);
    // if the obj returned by dao did'nt contain success key or success was false then the operation failed
    if (!getResponse.success){
        response.error = getResponse.error
        return response;
    }

    logging.log(apiReference, {event:'getSubtasks'});
    response.success = true;
    response.data = getResponse;
    return response;
}

exports.createSubtask = async(apiReference, opts)=>{
    let response = {success:false};
    logging.log(apiReference, {EVENT:"create subtask service"});

    // check if provided task exists
    let task_exists = await taskDao.taskExists(apiReference,opts);

    if(!task_exists.success){
        response.error = 'No Such Task Exists';
        return response;
    }

    else{
        logging.log(apiReference, {EVENT: "Task Exists"})
    }
    let subtasks = opts.subtask;
    let user = opts.user_id;
    let task_id = opts.task_id;
    logging.log(apiReference,{ EVENT : "createSubtask SERVICE", opts})
    
    
    // loop through each subtask and perform create operation
    for(i = 0; i< subtasks.length;i++){
        let insertObj = {
            task_id: task_id,
            subtask: subtasks[i],
            user_id: user
        }

        let getResponse = await todoDao.createSubtask(apiReference, insertObj);
        if(!getResponse.success){
            return response;
        }
    }

    response.success = true;
    response.data = `Added Sucessfully`;
    return response;
};


exports.deleteSubtask = async(apiReference, opts)=>{
    let response = {success: false};
    logging.log(apiReference, {EVENT: "deleteSubtask Service", opts});

    // Check first if the subtask's  exists or is not deleted already
    let subtask_exists = await todoDao.subTaskExists(apiReference, opts);
    if(!subtask_exists.success){
        response.error = subtask_exists.error;
        return response
    }

    let getResponse = await todoDao.deleteSubtask(apiReference, opts);

    if(!getResponse.success){
        response.error = getResponse.error;
        return response;
    }
    
    response.success = true;
    response.data = 'Deleted Successfully';
    return response
}

exports.updateSubtask = async(apiReference, opts)=>{
    let response = {success: false};

    logging.log(apiReference, {EVENT:"updateSubtask Service"}, opts);
    let whereOpts = {};

    if(opts.task_id){
        whereOpts.task_id = opts.task_id;
    }
    if(opts._id){
        whereOpts._id = opts._id;
    }
    if(opts.id){
        whereOpts.id = opts.id
    }
    if(opts.user_id){
        whereOpts.user_id = opts.user_id;
    }
    // Check first if the subtask's  exists or is not deleted already
    let subtask_exists = await todoDao.subTaskExists(apiReference, whereOpts);
    if(!subtask_exists.success){
        response.error = "No such subtask is active or exists";
        return response
    }

    let getResponse = await todoDao.updateSubtask(apiReference, opts)  ;

    if (!getResponse.success){
        response.error = getResponse.error;
        return response;
    }

    response.success = true;
    response.data = 'Updation successful';

    return response;
}





