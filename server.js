const sql = require('mssql');
const express = require('express');
const app = express();

// Cấu hình kết nối SQL Server
const config = {
    user: 'sa', 
    password: 'Mat_Khau_Cua_Bạn', // Nhớ thay đúng mật khẩu SQL Server của bạn
    server: 'localhost', 
    database: 'QuanLyThuePhong', 
    options: {
        encrypt: false, 
        trustServerCertificate: true
    }
};

// Hàm kết nối
async function connectDatabase() {
    try {
        await sql.connect(config);
        console.log("--- CHÚC MỪNG: SQL SERVER ĐÃ KẾT NỐI THÀNH CÔNG ---");
    } catch (err) {
        console.error("Lỗi kết nối database: ", err.message);
    }
}

connectDatabase();

// Chạy Server ở cổng 3000
app.listen(3000, () => {
    console.log("Backend đang chạy tại: http://localhost:3000");
});