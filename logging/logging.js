// we use this file to define functions to log errors and conditions and check some necessary flags to log the results


const moment = require('moment');

const fileSwitches = {
    startup :       true,
    todo    :       true,
    login   :       true,
    register:       true
}

const modules = {
    todo:{
        getTask: true,
        updateTask: true,
        deleteTask : true,
        createTask: true,

        getSubtasks: true,
        deleteSubtask: true,
        createSubtask: true,
        updateSubtask: true,

    },
    startup:{
        initialize: true
    },
    login : {
        login : true
    },
    register:{
        register: true
    }
}

const log = async(apiReference, log)=>{
    if( apiReference 
        && log 
        && apiReference.module 
        && apiReference.api
        && fileSwitches
        && modules 
        && fileSwitches[apiReference.module]== true ){

            try {
                log = JSON.stringify(log);
            }
            catch(error){
                console.error(`There is error ----${error}----`)
            }
            console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')+ '-----'
                        + apiReference.module + '-----'+ apiReference.api + '-----'+ log)
        }
};

const logError = async(apiReference, log)=>{
    if (apiReference
        && apiReference.module
        && apiReference.api) {
    
        try {
            log = JSON.stringify(log);
        }
        catch (exception) {
        }
        console.error(" " + moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS') + " ----- " +
            apiReference.module + " ----- " + apiReference.api + " ----- " + log);
    }
};


exports.log = log;
exports.logError = logError;