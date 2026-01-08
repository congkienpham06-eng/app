document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("roomInfo");
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  const roomId = sessionStorage.getItem("roomId");
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const room = rooms.find(r => r.id == roomId);

  if (!room) {
    container.innerHTML = "<p>Không tìm thấy thông tin phòng</p>";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const owner = users.find(u => u.username === room.owner);
  const ownerName = owner ? (owner.fname || owner.username) : "Không rõ";

  container.innerHTML = `
    ${room.image ? `<img src="${room.image}" class="room-img">` : ""}
    <div class="card">
      <h3>${room.title}</h3>
      <p><b>Giá:</b> ${room.price} VND</p>
      <p><b>Địa chỉ:</b> ${room.address}</p>
      <p><b>Chủ phòng:</b> ${ownerName}</p>
      ${room.mota ? `<p><b>Mô tả:</b> ${room.mota}</p>` : ""}
      <button onclick="fav()">❤️ Thêm ưa thích</button>
    </div>
  `;

  // Nút Thuê: chỉ ẩn với chính chủ
  if (room.owner !== currentUser) {
    const rentBtn = document.createElement("button");
    rentBtn.innerText = "Thuê phòng";
    rentBtn.onclick = () => {
      // không đánh dấu rentedBy tại đây
      sessionStorage.setItem("paymentRoomId", room.id);
      location.href = "../payment/payment.html";
    };
    container.appendChild(rentBtn);
  }

  // Hàm ưa thích
  window.fav = function() {
    const favs = JSON.parse(localStorage.getItem("favorites")) || {};
    favs[currentUser] = favs[currentUser] || [];
    if (!favs[currentUser].includes(roomId)) {
      favs[currentUser].push(roomId);
      localStorage.setItem("favorites", JSON.stringify(favs));
      alert("Đã thêm vào ưa thích ❤️");
    } else {
      alert("Phòng đã có trong ưa thích");
    }
  }
});
