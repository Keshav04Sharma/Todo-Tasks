'use strict';

const jwtService = require('../services/jwtService');
const responses = require('../responses/responses');
const logging = require('../logging/logging');

// mainly to check res.locals but in our case no needed because in this cache we will have "bypass_user_auth" field to skip auth operation.
exports.authenticateUser = async (req, res, next) =>{
    
    let apiReference = req.apiReference;

    logging.log(apiReference, { EVENT: "Inside authenticateUser"});

    await validations(req, res, next);
    

}

const validations = async (req, res, next) => {
    const requestHeader = {...req.headers};

    let decodeToken = await jwtService.verifyJwt(req.apiReference, requestHeader["access_token"]);
    console.log(decodeToken);
    if(!decodeToken){
        return responses.invalidAuthKey(res);
    }

    res.locals.auth_details = decodeToken;

    return next();
}