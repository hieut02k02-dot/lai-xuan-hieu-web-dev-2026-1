// lab9/lab9.js
const API_KEY = "laihieu_mospolytech_2026"; 
const API_URL_ORDERS = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";

let orders = [];
let editingId = null;
let deletingId = null;

// === TIỆN ÍCH (Format ngày tháng, giá tiền) ===
function formatDate(isoString) {
    if (!isoString) return "—";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function formatDelivery(order) {
    return (order.delivery_type === "by_time" && order.delivery_time) ? order.delivery_time : "Как можно скорее (с 7:00 до 23:00)";
}

// === 1. TẢI DỮ LIỆU ===
async function loadOrders() {
    let apiOrders = [];
    let localOrders = [];

    // Lấy đơn từ LocalStorage (các đơn đặt lúc API sập)
    try {
        localOrders = JSON.parse(localStorage.getItem('food_orders')) || [];
        localOrders.forEach(o => o.is_local = true);
    } catch (e) { localOrders = []; }

    // Thử lấy đơn từ API (để thầy thấy)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${API_URL_ORDERS}?api_key=${API_KEY}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
                apiOrders = data.map(o => ({ ...o, is_local: false }));
            }
        }
    } catch (e) {
        console.log("API sập, chỉ hiển thị đơn LocalStorage");
    }

    // Gộp 2 mảng
    orders = [...apiOrders, ...localOrders];
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    renderOrders();
}

// Lưu lại riêng mảng LocalStorage (không lưu đè đơn của API)
function saveLocalOrders() {
    const localOnly = orders.filter(o => o.is_local);
    localStorage.setItem('food_orders', JSON.stringify(localOnly));
}

// === 2. HIỂN THỊ BẢNG ===
function renderOrders() {
    const tbody = document.getElementById("orders-body");
    const emptyMsg = document.getElementById("orders-empty");
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = "";
        if(emptyMsg) emptyMsg.style.display = "block";
        return;
    }

    if(emptyMsg) emptyMsg.style.display = "none";

    tbody.innerHTML = orders.map((order, index) => `
        <tr>
            <td data-label="№">${index + 1}</td>
            <td data-label="Дата">${formatDate(order.created_at)}</td>
            <td data-label="Состав">${order.dishes || "—"}</td>
            <td data-label="Стоимость">${order.total_price ? order.total_price + ' ₽' : "—"}</td>
            <td data-label="Доставка">${formatDelivery(order)}</td>
            <td data-label="Действия">
                <div class="order-actions">
                    <button class="btn-icon" data-action="detail" data-id="${order.id}"><i class="bi bi-eye"></i></button>
                    <button class="btn-icon" data-action="edit" data-id="${order.id}"><i class="bi bi-pencil"></i></button>
                    <button class="btn-icon btn-icon--danger" data-action="delete" data-id="${order.id}"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join("");
}

// === 3. MODAL & LẤY DỮ LIỆU ===
function openModal(id) { document.getElementById(id).classList.add("active"); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }
function getOrderById(id) { return orders.find(o => String(o.id) === String(id)); }

function showDetail(id) {
    const order = getOrderById(id);
    if (!order) return;
    document.getElementById("detail-body").innerHTML = `
        <div class="detail-list">
            <div class="detail-row"><span class="detail-label">Дата</span><span class="detail-value">${formatDate(order.created_at)}</span></div>
            <div class="detail-row"><span class="detail-label">Состав</span><span class="detail-value">${order.dishes || "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Стоимость</span><span class="detail-value">${order.total_price ? order.total_price + ' ₽' : "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Имя</span><span class="detail-value">${order.full_name || "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Телефон</span><span class="detail-value">${order.phone || "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Адрес</span><span class="detail-value">${order.delivery_address || "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Комментарий</span><span class="detail-value">${order.comment || "—"}</span></div>
        </div>`;
    openModal("modal-detail");
}

function showEdit(id) {
    const order = getOrderById(id);
    if (!order) return;
    editingId = order.id;
    document.getElementById("edit-full-name").value = order.full_name || "";
    document.getElementById("edit-email").value = order.email || "";
    document.getElementById("edit-phone").value = order.phone || "";
    document.getElementById("edit-address").value = order.delivery_address || "";
    const isByTime = order.delivery_type === "by_time";
    document.getElementById("edit-now").checked = !isByTime;
    document.getElementById("edit-by-time").checked = isByTime;
    document.getElementById("edit-time").value = isByTime ? (order.delivery_time || "") : "";
    document.getElementById("edit-time").disabled = !isByTime;
    document.getElementById("edit-comment").value = order.comment || "";
    openModal("modal-edit");
}

function showDelete(id) {
    if (!getOrderById(id)) return;
    deletingId = id;
    openModal("modal-delete");
}

// === 4. XỬ LÝ SỰ KIỆN ===
document.getElementById("orders-body")?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === "detail") showDetail(id);
    if (btn.dataset.action === "edit") showEdit(id);
    if (btn.dataset.action === "delete") showDelete(id);
});

document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", (e) => {
    closeModal(e.target.closest("[data-close]").dataset.close);
}));

document.querySelectorAll('input[name="delivery_type"]').forEach(radio => radio.addEventListener("change", () => {
    const isByTime = document.getElementById("edit-by-time").checked;
    document.getElementById("edit-time").disabled = !isByTime;
}));

// NÚT LƯU (SỬA)
document.getElementById("edit-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const order = getOrderById(editingId);
    if (!order) return;

    const deliveryType = document.querySelector('input[name="delivery_type"]:checked')?.value || "now";
    const updatedData = {
        full_name: document.getElementById("edit-full-name").value.trim(),
        email: document.getElementById("edit-email").value.trim(),
        phone: document.getElementById("edit-phone").value.trim(),
        delivery_address: document.getElementById("edit-address").value.trim(),
        delivery_type: deliveryType,
        delivery_time: deliveryType === "by_time" ? document.getElementById("edit-time").value : null,
        comment: document.getElementById("edit-comment").value.trim(),
    };

    if (order.is_local) {
        // Sửa đơn LocalStorage
        Object.assign(order, updatedData);
        saveLocalOrders();
        closeModal("modal-edit");
        alert("Đã sửa đơn hàng lưu cục bộ!");
        renderOrders();
    } else {
        // Sửa đơn API
        try {
            const res = await fetch(`${API_URL_ORDERS}/${editingId}?api_key=${API_KEY}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });
            if (!res.ok) throw new Error();
            Object.assign(order, updatedData);
            closeModal("modal-edit");
            alert("Đã sửa đơn hàng trên Server!");
            renderOrders();
        } catch (err) {
            alert("Không thể sửa đơn trên Server (API lỗi).");
        }
    }
});

// NÚT XÓA
document.getElementById("confirm-delete")?.addEventListener("click", async () => {
    const order = getOrderById(deletingId);
    if (!order) return;

    if (order.is_local) {
        // Xóa đơn LocalStorage
        orders = orders.filter(o => String(o.id) !== String(deletingId));
        saveLocalOrders();
        closeModal("modal-delete");
        alert("Đã xóa đơn hàng cục bộ!");
        renderOrders();
    } else {
        // Xóa đơn API
        try {
            const res = await fetch(`${API_URL_ORDERS}/${deletingId}?api_key=${API_KEY}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error();
            orders = orders.filter(o => String(o.id) !== String(deletingId));
            closeModal("modal-delete");
            alert("Đã xóa đơn hàng trên Server!");
            renderOrders();
        } catch (err) {
            alert("Không thể xóa đơn trên Server (API lỗi).");
        }
    }
});

// Khởi chạy
document.addEventListener("DOMContentLoaded", loadOrders);