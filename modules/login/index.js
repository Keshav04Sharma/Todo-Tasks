
const loginValidator = require("./validators/loginValidators");
const loginController = require("./controller/loginController");

router.post('/login', loginValidator.login, loginController.login);