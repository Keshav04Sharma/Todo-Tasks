// this file serves as the entry point of the whole code 
// This file imports the server and todo list files needed to start app
'use strict';
const express           = require('express');
const router            = express.Router();
global.app = express();
global.router = router;
app.use(express.json());
require('./middleware');
require('./modules');
require('./startup/').initializeServer();


module.exports.app = app;
module.exports = router;