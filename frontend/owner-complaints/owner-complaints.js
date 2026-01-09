document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser"); // chủ phòng
  const complaintList = document.getElementById("complaintList");

  if (!currentUser) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

  // Các phòng của chủ
  const ownerRoomIds = rooms.filter(r => r.owner === currentUser).map(r => r.id.toString());

  // Lọc khiếu nại chưa thu hồi
  const ownerComplaints = complaints.filter(c => ownerRoomIds.includes(c.roomId) && !c.revoked);

  if (!ownerComplaints.length) {
    complaintList.innerHTML = "<p>Chưa có khiếu nại nào</p>";
    return;
  }

  complaintList.innerHTML = "";
  ownerComplaints.forEach(c => {
    const room = rooms.find(r => r.id.toString() == c.roomId);
    const div = document.createElement("div");
    div.className = "card";
    div.style.cursor = "pointer";

    // Hiển thị thông tin sơ lược, click để vào chi tiết
    const date = new Date(c.time);
    const dateStr = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

    div.innerHTML = `
      <p><b>Phòng:</b> ${room?.title || c.roomId}</p>
      <p><b>Người khiếu nại:</b> ${c.user}</p>
      <p><b>Ngày:</b> ${dateStr}</p>
      <p><b>Lý do tóm tắt:</b> ${c.reason.slice(0,50)}${c.reason.length>50?'...':''}</p>
    `;

    div.onclick = () => {
      sessionStorage.setItem("complaintRoomId", c.roomId);
      sessionStorage.setItem("complaintUser", c.user); // để hiển thị đúng người khiếu nại
      location.href = "../complaint/complaint-detail.html";
    };
    complaintList.appendChild(div);
  });
});
