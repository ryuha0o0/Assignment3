const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');


// 1. 모든 Task 가져오기
router.get('/', authMiddleware,taskController.getAllTasks);

// 2. 특정 Task 가져오기
router.get('/:id', authMiddleware,taskController.getTaskById);

// 3. 새로운 Task 생성
router.post('/', authMiddleware,taskController.createTask);

// 4. Task 업데이트
router.put('/:id', authMiddleware,taskController.updateTask);

// 5. Task 삭제
router.delete('/:id', authMiddleware,taskController.deleteTask);

module.exports = router;
