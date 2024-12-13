const Company = require('../models/Company');

/**
 * 모든 회사 정보를 조회합니다. (GET /companies)
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 회사 정보 배열 반환
 * @throws {Error} - 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
exports.getAllCompanies = async (req, res, next) => {
    try {
        // 모든 회사 데이터를 조회합니다.
        const companies = await Company.findAll(); // Sequelize의 findAll() 메서드 사용

        // 조회된 회사 데이터를 클라이언트에 반환합니다.
        res.status(200).json(companies);
    } catch (err) {
        next(err); // 에러 처리 미들웨어로 전달
    }
};

/**
 * 새로운 회사를 생성합니다. (POST /companies)
 * @param {Object} req - 요청 객체
 * @param {Object} req.body - 생성할 회사 정보
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 생성된 회사 정보 반환
 * @throws {Error} - 유효성 검사 실패 또는 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
exports.createCompany = async (req, res, next) => {
    try {
        // 요청 바디에 있는 데이터를 기반으로 새로운 회사를 생성합니다.
        const company = await Company.create(req.body); // Sequelize의 create() 메서드 사용

        // 생성된 회사 데이터를 클라이언트에 반환합니다.
        res.status(201).json(company);
    } catch (err) {
        next(err); // 에러 처리 미들웨어로 전달
    }
};

/**
 * ID를 기반으로 특정 회사 정보를 조회합니다. (GET /companies/:id)
 * @param {Object} req - 요청 객체
 * @param {Object} req.params - URL 파라미터 (id)
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 특정 회사 정보 반환
 * @throws {Error} - 회사가 존재하지 않거나 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
exports.getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params; // URL 파라미터에서 회사 ID 추출

        // 특정 회사 정보를 조회합니다.
        const company = await Company.findOne({ where: { id } }); // findById 대신 findOne 사용

        // 회사가 존재하지 않을 경우, 404 상태 코드로 응답합니다.
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // 조회된 회사 데이터를 클라이언트에 반환합니다.
        res.status(200).json(company);
    } catch (err) {
        next(err); // 에러 처리 미들웨어로 전달
    }
};

/**
 * ID를 기반으로 특정 회사를 삭제합니다. (DELETE /companies/:id)
 * @param {Object} req - 요청 객체
 * @param {Object} req.params - URL 파라미터 (id)
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 * @returns {void} - 삭제 결과 반환
 * @throws {Error} - 회사가 존재하지 않거나 서버 에러 발생 시 예외 처리 미들웨어로 전달
 */
exports.deleteCompany = async (req, res, next) => {
    try {
        const { id } = req.params; // URL 파라미터에서 회사 ID 추출

        // 회사 데이터를 삭제합니다.
        const rowsDeleted = await Company.destroy({ where: { id } }); // destroy() 메서드 사용

        // 삭제된 데이터가 없을 경우, 404 상태 코드로 응답합니다.
        if (!rowsDeleted) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // 삭제 성공 메시지를 반환합니다.
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (err) {
        next(err); // 에러 처리 미들웨어로 전달
    }
};
