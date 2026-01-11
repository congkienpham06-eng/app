const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/danh-sach', async (req, res) => {
    try {
        let result = await sql.query`SELECT * FROM Phong`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send("Lỗi lấy dữ liệu: " + err.message);
    }
});

module.exports = router;