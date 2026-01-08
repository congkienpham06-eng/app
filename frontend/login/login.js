function login() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    u => u.username === username.value && u.password === password.value
  );

  if (!user) {
    alert("Sai tài khoản hoặc mật khẩu");
    return;
  }

  localStorage.setItem("currentUser", user.username);
  location.href = "../home/home.html";
}
