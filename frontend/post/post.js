// === Khai báo biến ===
const title = document.getElementById("title");
const citySelect = document.getElementById("city");
const districtSelect = document.getElementById("district");
const wardInput = document.getElementById("ward");
const detailAddress = document.getElementById("detailAddress");
const price = document.getElementById("price");
const image = document.getElementById("image");
const mota = document.getElementById("mota");
const preview = document.getElementById("preview");

// === Preview ảnh ===
image.onchange = () => {
  const file = image.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
};

// === Load address.json ===
let addressData = {};
fetch("../assets/data/address.json")
  .then(res => res.json())
  .then(data => {
    addressData = data;
    loadCities();
  })
  .catch(err => console.error("Lỗi load địa chỉ:", err));

// Load tỉnh
function loadCities() {
  citySelect.innerHTML = `<option value="">Tỉnh, thành phố</option>`;
  Object.keys(addressData).forEach(city => {
    citySelect.innerHTML += `<option value="${city}">${city}</option>`;
  });
}

// Load quận
function loadDistricts() {
  districtSelect.innerHTML = `<option value="">Quận, huyện</option>`;
  if (!citySelect.value) return;

  (addressData[citySelect.value] || []).forEach(district => {
    districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
  });
}

// Ward nhập tay, chỉ reset placeholder
function loadWards() {
  wardInput.value = "";
}

// === Đăng phòng ===
function postRoom() {
  if (
    !title.value ||
    !citySelect.value ||
    !districtSelect.value ||
    !wardInput.value ||
    !detailAddress.value ||
    !price.value
  ) {
    alert("Nhập đầy đủ thông tin");
    return;
  }

  const file = image.files[0];
  if (!file) {
    alert("Vui lòng chọn ảnh");
    return;
  }

  const img = new Image();
  const reader = new FileReader();

  reader.onload = function(e) {
    img.src = e.target.result;
  };

  img.onload = function() {
    const canvas = document.createElement("canvas");
    const MAX_WIDTH = 800;
    const scale = MAX_WIDTH / img.width;

    canvas.width = MAX_WIDTH;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const compressedImage = canvas.toDataURL("image/jpeg", 0.6);

    const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
    const currentUser = localStorage.getItem("currentUser");

    rooms.push({
      id: Date.now(),
      title: title.value,
      city: citySelect.value,
      district: districtSelect.value,
      ward: wardInput.value,
      detail: detailAddress.value,
      address: `${detailAddress.value}, ${wardInput.value}, ${districtSelect.value}, ${citySelect.value}`,
      price: price.value,
      image: compressedImage,
      mota: mota.value,
      owner: currentUser,
      rentedBy: null,
      paid: false
    });

    try {
      localStorage.setItem("rooms", JSON.stringify(rooms));
      alert("Đăng phòng thành công");
      location.href = "../home/home.html";
    } catch(e) {
      alert("Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn");
    }
  };

  reader.readAsDataURL(file);
}
