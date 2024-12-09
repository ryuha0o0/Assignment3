const Task = require('../models/Task');

// 1. 모든 Task 가져오기
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { userId: req.user.id },
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. 특정 Task 가져오기
exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({
            where: { id, userId: req.user.id }, // 현재 사용자만 접근 가능
        });
        if (!task) return res.status(404).json({ error: 'Task not found or access denied' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. 새로운 Task 생성
exports.createTask = async (req, res) => {
    try {
        const { title, dueDate } = req.body;
        const task = await Task.create({
            userId: req.user.id, // 현재 사용자의 ID로 Task 생성
            title,
            dueDate,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Task 업데이트
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, isCompleted, dueDate } = req.body;
        const task = await Task.findOne({
            where: { id, userId: req.user.id }, // 현재 사용자만 수정 가능
        });
        if (!task) return res.status(404).json({ error: 'Task not found or access denied' });

        await task.update({ title, isCompleted, dueDate });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// 5. Task 삭제
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({
            where: { id, userId: req.user.id }, // 현재 사용자만 삭제 가능
        });
        if (!task) return res.status(404).json({ error: 'Task not found or access denied' });

        await task.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};