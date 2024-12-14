const express = require('express');
const path = require('path');
const router = express.Router();

// 정적 파일 렌더링
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
