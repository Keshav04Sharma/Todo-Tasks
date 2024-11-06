const logging = require("../../../logging/logging");
const registerDao = require("../../register/dao/registerDao");
const constants = require("../../../responses/responseConstants");
const pwdService = require("../../../services/pwdService");
const loginTokenService = require("./loginTokenService");

exports.login = async (apiReference, opts) => {
    let response = {
        success: false
    };
    logging.log(apiReference, { EVENT: "login service", OPTS: opts });

    let queryValue = { email: opts.email };
    let loginInfo = await registerDao.fetchDetails(apiReference, queryValue);
    logging.log(apiReference,{ EVENT : "LOGIN INFO RESPONSE", RESPONSE : loginInfo});

    if (!loginInfo.success) {
        return loginInfo;
    }
    logging.log(apiReference, { EVENT: "CHecking for empty data" });
    
    // when no data in the db
    if (_.isEmpty(loginInfo.data[0])) {
        response.error = constants.responseMessages.USER_NOT_FOUND
        return response
    };

    loginInfo = loginInfo.data[0];
    console.log("loginInfo", loginInfo)
    const passwordComparision = await pwdService.compare(opts.password, loginInfo.password);

    // Password did not match with the one in db
    if (!passwordComparision) {
        response.error = constants.responseMessages.INVALID_CREDENTIALS;
        return response;
    }

    // Generate a token for login 
    const tokenResponse = await module.exports.createJwtToken(apiReference, loginInfo);

    loginInfo['access_token'] = tokenResponse;
    response.success = true
    response.data = { token : tokenResponse.data }
    return response;
}


exports.createJwtToken = async (apiReference, userInfo) => {
    logging.log(apiReference, { EVENT: "Login Service JWT method called" });
    let response = { success: false };

    let tokenKey = userInfo;
    let tokenResponse = await loginTokenService.setUpJwtToken(apiReference, tokenKey);

    response.success = true;
    response.data = tokenResponse;
    return response;
}