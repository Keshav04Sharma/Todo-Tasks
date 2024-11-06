const validator = require('../../../validators/fieldValidator');
const constants = require('../../../responses/responseConstants');
const apiReferenceModule = constants.modules.TODO;
const Joi = require('joi');
const logging = require('../../../logging/logging');
const dbProperties = require("../../../database/dbProperties");

const getTasks = async(req, res, next)=>{
    req.apiReference = {
        module: apiReferenceModule,
        api: 'getTasks'
    };
    const schema = Joi.object({
        offset: Joi.number().optional(),
        limit: Joi.number().optional()
    });

    let reqBody = {...req.body};

    let valid = validator.validateField(apiReferenceModule, reqBody, res, schema);
    
    if(valid){
        next();
    }
};

const createTask = async(req, res, next)=>{
    req.apiReference = {
        module:  apiReferenceModule,
        api: 'createTask'
    };

    const schema = Joi.object({
        task: Joi.string().max(40).required()
    });

    let reqBody = {...req.body};

    let valid = await validator.validateField(apiReferenceModule, reqBody, res, schema);

    if(valid){
        next();
    }

};

const deleteTask = async(req, res, next)=>{
    req.apiReference = {
        module:  apiReferenceModule,
        api: 'deleteTask'
    };

    const schema = Joi.object({
        task : Joi.string().max(40).required()
    });

    let reqBody = {...req.body};

    let valid = await validator.validateField(apiReferenceModule, reqBody, res, schema);

    if(valid){
        next();
    }

};

const updateTask = async(req, res, next)=>{
    req.apiReference = {
        module: apiReferenceModule,
        api: 'updateTask'
    };
    let schema;
    if(dbProperties.selectedDb === 'mongo'){
        schema = Joi.object({
            _id: Joi.string().optional(),
        })
    }
    else{
        schema = Joi.object({
            id: Joi.number().optional()
        });
    }
    

    let reqBody = {...req.body.id};

    let valid = await validator.validateField(apiReferenceModule, reqBody, res, schema);

    if(valid){
        next();
    }

}


const getSubtasks= async(req, res, next)=>{
    req.apiReference = {
        module:apiReferenceModule,
        api: 'get subtask'
    };

    const schema = Joi.object({
        task_id: Joi.number().required(),
        offset: Joi.number().optional(),
        limit: Joi.number().optional()
    });

    let reqBody = {...req.body};

    let valid = await validator.validateField(apiReferenceModule, reqBody, res, schema);

    if(valid){
        next();
    }
};

const createSubtask = async(req, res, next)=>{
    req.apiReference = {
        module: apiReferenceModule,
        api: 'getSubtasks'
    };
    logging.log(req.apiReference, {EVENT: 'validating'});

    
    const schema = Joi.object({
        task_id: Joi.required(),
        subtask: Joi.array().items(Joi.string()).required()
    });

    let reqBody = {...req.body};
    let valid = await validator.validateField(apiReferenceModule, reqBody, res, schema);

    if(valid){
        next();
    }
}

const deleteSubtask = async(req, res, next)=>{
    req.apiReference = {
        module: apiReferenceModule,
        api: 'delete Subtask'
    };
    let schema;
    if(dbProperties.selectedDb === 'mongo'){
        schema = Joi.object({
            _id: Joi.string().optional(),
            task_id: Joi.string().optional(),
        })
    }
    else{
        schema = Joi.object({
            id: Joi.number().optional(),
            task_id: Joi.number().optional(),
        });
    }
    
    let reqBody = {...req.body};
    let valid = await validator.validateField(apiReferenceModule, reqBody, res, schema);
    if(valid){
        next();
    }
}

const updateSubtask= async(req, res, next)=>{
    req.apiReference = {
        module: apiReferenceModule,
        api: 'updateSubtask',
    };
    let schema;
    if (dbProperties.selectedDb === 'mongo'){
        schema = Joi.object({
            _id: Joi.string().required(),
            subtask: Joi.string().optional(),
            is_complete: Joi.number().optional()
        });

    }else{
        schema = Joi.object({
            id: Joi.number().required(),
            subtask: Joi.string().optional(),
            is_complete: Joi.number().optional()
        });
    }
    

    let reqBody = {...req.body};
    let valid = await validator.validateField(apiReferenceModule, reqBody, res, schema);
    if(valid){
        next();
    }
    
};

exports.createTask              = createTask;
exports.getTasks                = getTasks;
exports.deleteTask              = deleteTask;
exports.updateTask              = updateTask;

exports.createSubtask           = createSubtask;
exports.getSubtasks             = getSubtasks;
exports.deleteSubtask           = deleteSubtask;
exports.updateSubtask           = updateSubtask;