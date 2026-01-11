CREATE DATABASE CH_App;
GO
USE CH_App;

-- 1. Bảng Người dùng (theo yêu cầu bảo mật mã hóa)
CREATE TABLE NguoiDung (
    MaNguoiDung INT PRIMARY KEY IDENTITY(1,1),
    HoTen NVARCHAR(100),
    TaiKhoan VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL, 
    Email VARCHAR(100),
    VaiTro NVARCHAR(20) DEFAULT 'Member', -- 'Member' hoặc 'Admin'
    SoDuVi DECIMAL(18, 2) DEFAULT 0
);

-- 2. Bảng Phòng (Duyệt tin 3 bên)
CREATE TABLE Phong (
    MaPhong INT PRIMARY KEY IDENTITY(1,1),
    TieuDe NVARCHAR(200),
    GiaThue DECIMAL(18, 2),
    MoTa NVARCHAR(MAX),
    TrangThai NVARCHAR(50) DEFAULT 'ChoDuyet', -- 'ChoDuyet', 'DaDuyet'
    MaChuPhong INT FOREIGN KEY REFERENCES NguoiDung(MaNguoiDung)
);