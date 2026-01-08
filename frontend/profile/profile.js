document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("avatar");
  const nameEl = document.getElementById("name");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const address = document.getElementById("address");
  const bank = document.getElementById("bank");
  const img = document.getElementById("img");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const username = localStorage.getItem("currentUser");

  if (!username) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    alert("Tài khoản không tồn tại");
    sessionStorage.clear();
    location.href = "../login/login.html";
    return;
  }

  // Load dữ liệu profile
  nameEl.innerText = user.fname || user.username;
  phone.value = user.phone || "";
  email.value = user.email || "";
  address.value = user.address || "";
  bank.value = user.bank || "";
  avatar.src = user.avatar || "../assets/img/default-avatar.png";

  // Click avatar để chọn ảnh
  avatar.onclick = () => img.click();

  // Preview avatar
  img.onchange = () => {
    const file = img.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      avatar.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // Save
  window.save = function () {
    user.phone = phone.value;
    user.email = email.value;
    user.address = address.value;
    user.bank = bank.value;

    if (img.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        user.avatar = reader.result;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Đã lưu hồ sơ");
      };
      reader.readAsDataURL(img.files[0]);
    } else {
      localStorage.setItem("users", JSON.stringify(users));
      alert("Đã lưu hồ sơ");
    }
  };

  // Logout
  window.logout = function () {
    sessionStorage.clear();
    localStorage.removeItem("currentUser");
    location.href = "../login/login.html";
  };
});

