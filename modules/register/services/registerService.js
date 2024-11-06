const logging = require('../../../logging/logging');
const pwdService = require('../../../services/pwdService');
const constants = require('../../../responses/responseConstants');
const registerDao = require("../dao/registerDao");


exports.register = async(apiReference, opts)=>{

    let response = {
        success: false
    };

    logging.log(apiReference, {EVENT: "Registeration Service", OPTS: opts});

    // check if the email exits in the user db

    const emailOpts = {
        email: opts.email
    };

    // call dao fetch detail to query if the user data exists for a given email

    const userExists = await registerDao.fetchDetails(apiReference, emailOpts);
    logging.log(apiReference, {EVENT: "Fetching User Details", OPTS:emailOpts});

    // user data exists i.e user is already registerd
    if (userExists.data.length > 0 && userExists.data[0].length !==0){
        response.error = constants.responseMessages.ALREADY_EXISTS;
        return response;
    }

    // if no error then encrypt the password and update the DB

    opts.password = pwdService.encrypt(opts.password);

    logging.log(apiReference, {EVENT: "Registering the User", OPTS:opts});
    
    const userInsertion = await registerDao.register(apiReference, opts);

    if(!userInsertion.success){
        return userInsertion;
    }
    if(userInsertion.error){
        response.error = userInsertion.error;
        return response;
    }

    response.success = true;
    response.data = userInsertion.data;
    return response;
}
