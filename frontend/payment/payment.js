document.addEventListener("DOMContentLoaded", () => {
  const paymentContainer = document.getElementById("paymentInfo");
  if (!paymentContainer) return;

  const paymentRoomId = sessionStorage.getItem("paymentRoomId");
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  const room = rooms.find(r => r.id == paymentRoomId);
  if (!room) {
    paymentContainer.innerHTML = "<p>Không tìm thấy phòng để thanh toán</p>";
    return;
  }

  const owner = users.find(u => u.username === room.owner);
  const ownerName = owner?.fname || owner?.username || "Không rõ";
  const ownerPhone = owner?.phone || "Chưa có";

  const tenant = users.find(u => u.username === currentUser);
  const tenantName = tenant?.fname || tenant?.username || currentUser;
  const tenantPhone = tenant?.phone || "Chưa có";

  const today = new Date();
  const expire = new Date();
  expire.setDate(today.getDate() + 30);
  const formatDate = d => d.toISOString().split("T")[0];

  let selectedMethod = null;

  // Render các card thông tin
  paymentContainer.innerHTML = `
    <div class="card">
      <h3>Thông tin phòng</h3>
      <p><b>Tên phòng:</b> ${room.title}</p>
      <p><b>Địa chỉ:</b> ${room.address}</p>
      <p><b>Giá:</b> ${room.price} VND</p>
      <p><b>Ngày đặt:</b> ${formatDate(today)}</p>
      <p><b>Ngày hết hạn:</b> ${formatDate(expire)}</p>
    </div>

    <div class="card">
      <h3>Chủ phòng</h3>
      <p><b>Tên:</b> ${ownerName}</p>
      <p><b>SĐT:</b> ${ownerPhone}</p>
    </div>

    <div class="card">
      <h3>Người thuê</h3>
      <p><b>Tên:</b> ${tenantName}</p>
      <p><b>SĐT:</b> ${tenantPhone}</p>
    </div>

    <div class="card">
      <h3>Phương thức thanh toán</h3>
      <div id="paymentMethods" class="payment-grid">
        <div class="payCard" data-method="Momo">💰<span>Momo</span></div>
        <div class="payCard" data-method="Ngân hàng">🏦<span>Ngân hàng</span></div>
        <div class="payCard" data-method="Apple Pay">🍏<span>Apple Pay</span></div>
        <div class="payCard" data-method="Thẻ tín dụng/Napas">💳<span>Thẻ/Napas</span></div>
      </div>
    </div>

    <button id="payBtn" style="margin-top:20px;">Thanh toán</button>

    <!-- Note placeholder -->
    <div id="notePlaceholder"></div>
  `;

  // Chọn phương thức
  const methodCards = document.querySelectorAll("#paymentMethods .payCard");
  methodCards.forEach(card => {
    card.onclick = () => {
      methodCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedMethod = card.dataset.method;
    };
  });

  // Thanh toán
  document.getElementById("payBtn").onclick = () => {
    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }
    room.rentedBy = currentUser;
    room.paid = true;
    room.paymentMethod = selectedMethod;
    localStorage.setItem("rooms", JSON.stringify(rooms));

    alert(`Thanh toán thành công bằng ${selectedMethod}!\nPhòng sẽ biến mất khỏi Home.`);
    location.href = "../home/home.html";
  };

  // Load note JSON
  fetch("../assets/data/note.json")
    .then(res => res.json())
    .then(data => {
      if (!data?.note) return;
      const noteDiv = document.createElement("div");
      noteDiv.className = "note-card";
      noteDiv.innerHTML = `
        <div class="icon">!</div>
        <div class="note-text">${data.note}</div>
      `;
      document.getElementById("notePlaceholder").appendChild(noteDiv);
    })
    .catch(err => console.error("Lỗi load note:", err));
});
