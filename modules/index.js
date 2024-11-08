'use strict';
require('./todo');
require("./todo_admin")
require('./register');
require('./login');

app.use('/api', router);