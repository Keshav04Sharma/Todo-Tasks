const Joi = require('joi');
const logging = require('../logging/logging');


const joiValidate = async(apiReference, reqBody, res, schema)=>{
    logging.log(apiReference, {EVENT: 'Validate Fields', BODY:reqBody});
    try{
        let validation = await schema.validateAsync(reqBody);
        logging.log(apiReference, {validationRes: validation});
        return true;
    }
    catch(err){
        logging.logError(apiReference, {EVENT: "validation", RESULT: err});
        return false
    }
}


const validateField = async(apiReference, reqBody, res, schema)=>{
    return await joiValidate(apiReference, reqBody, res, schema);
}

exports.validateField = validateField;