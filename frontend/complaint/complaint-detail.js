document.addEventListener("DOMContentLoaded", () => {
  const complaintRoomId = sessionStorage.getItem("complaintRoomId");
  const currentUser = localStorage.getItem("currentUser");

  if (!complaintRoomId || !currentUser) {
    alert("Thiếu thông tin khiếu nại hoặc người dùng");
    history.back();
    return;
  }

  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const complaint = complaints.find(
    c =>
      c.roomId == complaintRoomId &&
      (c.user === currentUser || rooms.find(r => r.id == c.roomId)?.owner === currentUser)
  );

  if (!complaint) {
    alert("Không tìm thấy khiếu nại");
    history.back();
    return;
  }

  const container = document.getElementById("complaintDetail");
  const room = rooms.find(r => r.id == complaint.roomId);
  const images = complaint.images || [];

  let html = `
    <h3>Phòng: ${room?.title || complaint.roomId}</h3>
    <p><b>Người khiếu nại:</b> ${complaint.user}</p>
    <p><b>Lý do:</b> ${complaint.reason}</p>
    <p><b>Ngày gửi:</b> ${new Date(complaint.time).toLocaleString()}</p>
    <p><b>Địa chỉ:</b> ${room?.address || "Chưa có"}</p>
    ${images.length ? `<img src="${images[0]}" class="complaint-img" id="complaintImg">` : ""}
    ${images.length > 1 ? `<p style="text-align:center;color:#888;">Nhấn ảnh hoặc dùng ‹ › để xem các ảnh khác</p>` : ""}
  `;

  // Nút thu hồi hoặc đã thu hồi
  if (complaint.user === currentUser) {
    if (!complaint.revoked) {
      html += `<button id="retractBtn">Thu hồi khiếu nại</button>`;
    } else {
      html += `<button disabled style="background:#ccc; cursor:not-allowed;">
                 ✔ Đã thu hồi khiếu nại
               </button>`;
    }
  }

  container.innerHTML = html;

  // ===== Thu hồi =====
  const retractBtn = document.getElementById("retractBtn");
  if (retractBtn) {
    retractBtn.onclick = () => {
      if (confirm("Bạn có chắc muốn thu hồi khiếu nại này?")) {
        complaint.revoked = true;
        localStorage.setItem("complaints", JSON.stringify(complaints));

        // Cập nhật rooms để đổi nút rentedRooms
        const roomData = rooms.find(r => r.id == complaint.roomId);
        if (roomData) roomData.revoked = true;
        localStorage.setItem("rooms", JSON.stringify(rooms));

        alert("Đã thu hồi khiếu nại.");
        history.back(); // quay về danh sách phòng thuê
      }
    };
  }

  // ===== LIGHTBOX =====
  if (images.length) {
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    const lbClose = document.querySelector("#lightbox .close");
    const btnPrev = document.querySelector("#lightbox .nav.left");
    const btnNext = document.querySelector("#lightbox .nav.right");

    let currentIndex = 0;

    const showImg = index => {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;
      lbImg.src = images[currentIndex];
    };

    const mainImg = document.getElementById("complaintImg");
    if (mainImg) {
      mainImg.onclick = () => {
        showImg(0);
        lb.classList.add("show");
      };
    }

    if (lbClose) lbClose.onclick = () => lb.classList.remove("show");
    if (btnPrev) btnPrev.onclick = () => showImg(currentIndex - 1);
    if (btnNext) btnNext.onclick = () => showImg(currentIndex + 1);

    lb.onclick = e => {
      if (e.target === lb) lb.classList.remove("show");
    };
  }
});
