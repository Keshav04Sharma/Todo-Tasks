"use strict";

const logging = require("../logging/logging");
let jwt = require('jsonwebtoken');
const dbProperties = require("../database/dbProperties");

const key = "nadna69dnjand344hiknins";

const createJwt = async(apiReference, opts, expireTime)=>{
    logging.log(apiReference, {EVENT: "Creating a JWT Token Service", OPTS:opts});
    let user;
    if (dbProperties.selectedDb ==='mongo'){
        user = opts._id;
    }else{user = opts.user_id;}
    let payload =  {
        f_name: opts.f_name,
        l_name: opts.l_name,
        email: opts.email,
        user_id: user,
        role: opts.role
    }
    
    return jwt.sign(payload, key, {'expiresIn':expireTime});
}

const verifyJwt = async(apiReference, token)=>{
    logging.log(apiReference, {EVENT: "verifying JWT tokens"})
    let decoded ;

    try{
        decoded  = jwt.verify(token, key);
        logging.log(apiReference, {EVENT: "Token Verified Successfully"});
        return decoded;
    }
    catch(err){
        logging.logError(apiReference, {EVENT: "Token Not Verified"})
        console.log(err);
    }

}

exports.createJwt = createJwt;
exports.verifyJwt = verifyJwt;