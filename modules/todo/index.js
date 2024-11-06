const todoController = require('./controller/todoTaskController');
const todoValidator = require('../todo/validators/todoValidators');
const todoSubtaskController = require('../todo/controller/todoSubtaskController')
const userAuth = require("../../validators/authValidator").authenticateUser;


router.get('/tasks', todoValidator.getTasks,userAuth, todoController.getTasks );
router.post('/tasks', todoValidator.createTask,userAuth, todoController.createTask );
router.put('/tasks/del', todoValidator.deleteTask,userAuth, todoController.deleteTask);
router.put('/tasks', todoValidator.updateTask,userAuth, todoController.updateTask);

// subtask routes 

router.post('/subtasks', todoValidator.createSubtask,userAuth, todoSubtaskController.createSubtask);
router.get('/subtasks', todoValidator.getSubtasks,userAuth, todoSubtaskController.getSubtasks);
router.put('/subtasks/del', todoValidator.deleteSubtask,userAuth, todoSubtaskController.deleteSubtask);
router.put('/subtasks', todoValidator.updateSubtask,userAuth, todoSubtaskController.updateSubtask)