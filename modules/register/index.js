'use strict';

const registerController = require("./controller/registerController");
const registerValidator = require("./validators/registerValidators");


router.post('/register', registerValidator.register, registerController.register);