const adminAuth = require("../../validators/authValidator").authenticateAdmin;
const adminTaskController = require("./controller/adminTaskController");
const adminValidators = require("./validators/adminValidators");
const adminSubtaskController = require("./controller/adminSubtaskController");

router.get('/tasks/admin',adminValidators.getTasks, adminAuth, adminTaskController.getTasks);
router.post('/tasks/admin', adminValidators.createTask,adminAuth, adminTaskController.createTask);
router.put('/tasks/admin', adminValidators.updateTask, adminAuth, adminTaskController.updateTask);
router.put('/tasks/del/admin', adminValidators.deleteTask, adminAuth, adminTaskController.deleteTask);

router.get('/subtasks/admin',adminValidators.getSubtasks, adminAuth, adminSubtaskController.getSubtasks);
router.post('/subtasks/admin', adminValidators.createSubtask,adminAuth, adminSubtaskController.createSubtask);
router.put("/subtasks/admin", adminValidators.updateSubtask, adminAuth, adminSubtaskController.updateSubtask)
router.put("/subtasks/del/admin", adminValidators.deleteSubtask, adminAuth, adminSubtaskController.deleteSubtask)



