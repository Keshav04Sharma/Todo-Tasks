// const loginService = require()
const logging = require("../../../logging/logging");
const responses = require("../../../responses/responses");
const loginService = require("../services/loginService");

exports.login = async (req, res, next) => {

    let reqBody = { ...req.body };
    let apiReference = req.apiReference;
    // let user_id = res.locals.auth_details
    try {

        const response = await loginService.login(apiReference, reqBody);

        if (response.success) {
            return responses.success(res, response.data);
        }
        return responses.failure(res, response.error);
    }

    catch (err) {
        console.log(err);
    }
}