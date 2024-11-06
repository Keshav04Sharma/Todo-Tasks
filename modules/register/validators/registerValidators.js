const constants = require("../../../responses/responseConstants");
const logging = require("../../../logging/logging");
const Joi = require('joi');
const apiReferenceModule = constants.modules.REGISTER;
const validator = require("../../../validators/fieldValidator");

exports.register = async(req, res, next)=>{


    req.apiReference = {
        module: apiReferenceModule,
        api: 'Register'
    };

    reqBody = {...req.body};
    logging.log(apiReferenceModule, {EVENT: "validating registeration data"});

    let schema = Joi.object({
        f_name: Joi.string().max(50).required(),
        l_name: Joi.string().max(50).required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    });

    let valid = validator.validateField(apiReferenceModule, req, res, schema);

    if(valid){
        next();
    }
}