const logging = require("../../../logging/logging");
const constants = require("../../../responses/responseConstants");
const apiReferenceModule = constants.modules.LOGIN;
const Joi = require('joi');
const validator = require("../../../validators/fieldValidator");


exports.login = async(req, res, next)=>{
    req.apiReference = {
        module: apiReferenceModule,
        api: "Login"
    };
    
    let reqBody = {...req.body};

    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });

    logging.log(req.apiReference, {EVENT:"Login Validator", body:reqBody});

    const valid = await validator.validateField(apiReferenceModule, reqBody, res, schema);
    console.log(valid);
    if(valid){
        next();
    }
}