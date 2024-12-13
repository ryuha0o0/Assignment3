const Task = require('../models/Task');

/**
 * 1. 모든 Task 가져오기
 *
 * @function getAllTasks
 * @async
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {void} - 200 상태 코드와 모든 Task 리스트를 JSON으로 반환
 * @throws {Error} - 서버 오류 발생 시 500 상태 코드와 에러 메시지를 JSON으로 반환
 *
 * 비즈니스 규칙: 현재 사용자의 모든 Task를 가져와야 하므로,
 * 사용자 ID를 기반으로 필터링하여 조회한다.
 */
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

/**
 * 2. 특정 Task 가져오기
 *
 * @function getTaskById
 * @async
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {void} - 200 상태 코드와 특정 Task 객체를 JSON으로 반환
 * @throws {Error} - 서버 오류 발생 시 500 상태 코드와 에러 메시지를 JSON으로 반환
 *
 * 주요 알고리즘: 요청 파라미터에서 ID를 추출하고, 해당 Task가 존재하는지 확인한다.
 * 존재하지 않으면 404 상태 코드와 함께 오류 메시지를 반환한다.
 */
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

/**
 * 3. 새로운 Task 생성
 *
 * @function createTask
 * @async
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {void} - 201 상태 코드와 생성된 Task 객체를 JSON으로 반환
 * @throws {Error} - 서버 오류 발생 시 500 상태 코드와 에러 메시지를 JSON으로 반환
 *
 * 비즈니스 규칙: 새 Task를 생성할 때, 현재 사용자의 ID를 Task의 userId로 설정한다.
 * 이때 요청 본문에서 제목과 기한을 받아와서 새로운 Task를 만든다.
 */
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

/**
 * 4. Task 업데이트
 *
 * @function updateTask
 * @async
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {void} - 200 상태 코드와 업데이트된 Task 객체를 JSON으로 반환
 * @throws {Error} - 서버 오류 발생 시 500 상태 코드와 에러 메시지를 JSON으로 반환
 *
 * 주요 알고리즘: 요청 파라미터에서 Task ID를 추출한 후,
 * 해당 Task가 존재하는지 확인한다. 존재하지 않으면 404 상태 코드와 오류 메시지를 반환한다.
 * 존재한다면, 제목, 완료 여부, 기한을 업데이트한다.
 */
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

/**
 * 5. Task 삭제
 *
 * @function deleteTask
 * @async
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {void} - 204 상태 코드와 응답 본문 없이 Task 삭제 완료
 * @throws {Error} - 서버 오류 발생 시 500 상태 코드와 에러 메시지를 JSON으로 반환
 *
 * 비즈니스 규칙: 현재 사용자만 삭제할 수 있도록 제한한다.
 * 요청 파라미터에서 Task ID를 추출하여 해당 Task가 존재하는지 확인한 후 삭제한다.
 */
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
