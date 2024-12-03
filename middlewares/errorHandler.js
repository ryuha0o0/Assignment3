module.exports = (err, req, res, next) => {
    // 에러 스택을 로그로 출력 (디버깅용)
    console.error(err.stack);

    // 에러 상태 코드와 메시지 설정
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // 클라이언트에 에러 응답을 보냄
    res.status(statusCode).json({
        error: {
            message,
            statusCode,
        },
    });

    // 에러 핸들링이 끝난 후, 다른 미들웨어로 제어를 넘길 필요가 있으면 `next()`를 호출
    next(err);
};
