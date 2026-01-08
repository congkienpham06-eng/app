document.addEventListener("DOMContentLoaded", () => {
  const rentedRoomList = document.getElementById("rentedRoomList");
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  // Chỉ lấy phòng đã thuê và đã thanh toán
  const rentedRooms = rooms.filter(r => r.rentedBy === currentUser && r.paid);

  if (rentedRooms.length === 0) {
    rentedRoomList.innerHTML = "<p>Bạn chưa thuê phòng nào</p>";
    return;
  }

  rentedRooms.forEach(room => {
    const roomEl = document.createElement("div");
    roomEl.className = "card";
    roomEl.innerHTML = `
      ${room.image ? `<img src="${room.image}" class="room-img">` : ""}
      <h3>${room.title}</h3>
      <p><b>Địa chỉ:</b> ${room.address}</p>
      <p><b>Giá:</b> ${room.price} VND</p>
      <p><b>Chủ phòng:</b> ${room.owner}</p>

      <!-- Nút xem hóa đơn -->
      <button onclick="viewInvoice(${room.id})">🧾 Hóa đơn</button>
    `;
    rentedRoomList.appendChild(roomEl);
  });

  // Xem hóa đơn phòng thuê
  window.viewInvoice = function(id) {
    sessionStorage.setItem("roomId", id);
    location.href = "../invoices/invoice.html"; // chuyển sang folder invoices
  };
});
