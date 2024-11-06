'use strict';
const logging = require('../../../logging/logging');
const responses = require('../../../responses/responses');
const constants = require("../../../responses/responseConstants");
const registerService = require('../services/registerService');


exports.register = async(req, res , next)=>{
    let apiReference = req.apiReference;
    let reqBody = {...req.body};

    try{
        logging.log(apiReference, {EVENT: "Register Controller ", VALUES: reqBody});

        const response = await registerService.register(apiReference, reqBody);

        logging.log(apiReference, {EVENT: "Register Controller ", VALUES: reqBody});

        // if the op was a success
        if (response.success){
            return responses.success(res,response.data, constants.responseMessages.REGISTER_SUCCESS);
        }
        

        return responses.failure(res, {}, response.error);
    } 

    catch(err){
        console.log(err);
    }
}