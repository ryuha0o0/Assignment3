// 공통 응답 핸들러
exports.sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({ message, data });
};

exports.sendError = (res, error, message = 'An error occurred', statusCode = 500) => {
    res.status(statusCode).json({ message, error });
};
