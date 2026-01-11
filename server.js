const express = require('express');
const sql = require('mssql');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.json());

const config = {
    user: 'sa', 
    password: 'Nhóm3', 
    server: '127.0.0.1', 
    database: 'CH_App',
    options: {
        encrypt: false, 
        trustServerCertificate: true,
        instanceName: 'SQLEXPRESS' 
    },
    port: 1433 
};

// Kết nối Database
async function connectDatabase() {
    try {
        await sql.connect(config);
        console.log("--- CHÚC MỪNG: SQL SERVER 'CH_App' ĐÃ KẾT NỐI THÀNH CÔNG ---");
    } catch (err) {
        console.error("❌ Lỗi kết nối database: ", err.message);
    }
}
connectDatabase();

// --- API ĐĂNG KÝ ---
app.post('/register', async (req, res) => {
    try {
        const { HoTen, TaiKhoan, MatKhau, Email } = req.body; 
        let pool = await sql.connect(config);
        
        let result = await pool.request()
            .input('hoTen', sql.NVarChar, HoTen)
            .input('taiKhoan', sql.VarChar, TaiKhoan)
            .input('matKhau', sql.VarChar, MatKhau)
            .input('email', sql.VarChar, Email)
            .query(`INSERT INTO NguoiDung (HoTen, TaiKhoan, MatKhau, Email) 
                    OUTPUT INSERTED.MaNguoiDung
                    VALUES (@hoTen, @taiKhoan, @matKhau, @email)`);

        const newUserId = result.recordset[0].MaNguoiDung;

        await pool.request()
            .input('userId', sql.Int, newUserId)
            .query('INSERT INTO ViAo (MaNguoiDung, SoDu) VALUES (@userId, 0)');

        console.log(`✅ Đã đăng ký thành công: ${TaiKhoan}`);
        res.status(201).json({ success: true, message: "Đăng ký thành công!" });
    } catch (err) {
        console.error("❌ Lỗi đăng ký:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- API ĐĂNG NHẬP (MỚI) ---
app.post('/login', async (req, res) => {
    try {
        const { TaiKhoan, MatKhau } = req.body; 
        let pool = await sql.connect(config);

        let result = await pool.request()
            .input('taiKhoan', sql.VarChar, TaiKhoan)
            .input('matKhau', sql.VarChar, MatKhau)
            .query("SELECT * FROM NguoiDung WHERE TaiKhoan = @taiKhoan AND MatKhau = @matKhau");

        if (result.recordset.length > 0) {
            console.log(`✅ ${TaiKhoan} đã đăng nhập thành công!`);
            res.json({ 
                success: true, 
                message: "Đăng nhập thành công!",
                user: result.recordset[0] 
            });
        } else {
            res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
        }
    } catch (err) {
        console.error("❌ Lỗi đăng nhập:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(5000, () => {
    console.log(`🚀 Server chạy tại: http://localhost:5000`);
});