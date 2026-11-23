/* ============================================================
   LAB 9 — Đọc/Ghi 100% từ LocalStorage, giữ nguyên giao diện
   ============================================================ */

let orders = [];
let editingId = null;
let deletingId = null;

// ===== HÀM TIỆN ÍCH =====
function formatDate(isoString) {
    if (!isoString) return "—";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDelivery(order) {
    if (order.delivery_type === "by_time" && order.delivery_time) {
        return order.delivery_time;
    }
    return "Как можно скорее (с 7:00 до 23:00)";
}

// ===== TẢI DỮ LIỆU =====
function loadOrders() {
    let data = localStorage.getItem('food_orders');
    orders = data ? JSON.parse(data) : [];
    
    // Sắp xếp mới nhất lên đầu
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    renderOrders();
}

function saveOrders() {
    localStorage.setItem('food_orders', JSON.stringify(orders));
}

// ===== HIỂN THỊ BẢNG =====
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
                    <button class="btn-icon" title="Подробнее" data-action="detail" data-id="${order.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn-icon" title="Редактирование" data-action="edit" data-id="${order.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-icon btn-icon--danger" title="Удаление" data-action="delete" data-id="${order.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// ===== MODAL =====
function openModal(id) { document.getElementById(id).classList.add("active"); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }

function getOrderById(id) {
    return orders.find(o => String(o.id) === String(id));
}

// Xem chi tiết
function showDetail(id) {
    const order = getOrderById(id);
    if (!order) return;

    const body = document.getElementById("detail-body");
    body.innerHTML = `
        <div class="detail-list">
            <div class="detail-row"><span class="detail-label">Дата</span><span class="detail-value">${formatDate(order.created_at)}</span></div>
            <div class="detail-row"><span class="detail-label">Состав</span><span class="detail-value">${order.dishes || "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Стоимость</span><span class="detail-value">${order.total_price ? order.total_price + ' ₽' : "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Имя</span><span class="detail-value">${order.full_name || "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${order.email || "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Телефон</span><span class="detail-value">${order.phone || "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Адрес</span><span class="detail-value">${order.delivery_address || "—"}</span></div>
            <div class="detail-row"><span class="detail-label">Доставка</span><span class="detail-value">${formatDelivery(order)}</span></div>
            <div class="detail-row"><span class="detail-label">Комментарий</span><span class="detail-value">${order.comment || "—"}</span></div>
        </div>
    `;
    openModal("modal-detail");
}

// Mở form sửa
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

// Mở xác nhận xóa
function showDelete(id) {
    if (!getOrderById(id)) return;
    deletingId = id;
    openModal("modal-delete");
}

// ===== XỬ LÝ SỰ KIỆN =====
function handleTableClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "detail") showDetail(id);
    if (action === "edit") showEdit(id);
    if (action === "delete") showDelete(id);
}

function handleModalClose(e) {
    const target = e.target.closest("[data-close]");
    if (target) closeModal(target.dataset.close);
}

function handleOverlayClick(e) {
    if (e.target.classList.contains("modal")) e.target.classList.remove("active");
}

function handleDeliveryTypeChange() {
    const isByTime = document.getElementById("edit-by-time").checked;
    const timeInput = document.getElementById("edit-time");
    timeInput.disabled = !isByTime;
    if (!isByTime) timeInput.value = "";
}

// Lưu khi bấm nút Sửa
function handleEditSubmit(e) {
    e.preventDefault();
    if (!editingId) return;

    const index = orders.findIndex(o => String(o.id) === String(editingId));
    if (index === -1) return;

    const deliveryType = document.querySelector('input[name="delivery_type"]:checked')?.value || "now";
    
    orders[index] = {
        ...orders[index],
        full_name: document.getElementById("edit-full-name").value.trim(),
        email: document.getElementById("edit-email").value.trim(),
        phone: document.getElementById("edit-phone").value.trim(),
        delivery_address: document.getElementById("edit-address").value.trim(),
        delivery_type: deliveryType,
        delivery_time: deliveryType === "by_time" ? document.getElementById("edit-time").value : null,
        comment: document.getElementById("edit-comment").value.trim(),
    };

    saveOrders(); // Lưu vào LocalStorage
    closeModal("modal-edit");
    alert("Заказ успешно изменён");
    renderOrders();
}

// Lưu khi bấm nút Xóa
function handleConfirmDelete() {
    if (!deletingId) return;
    
    orders = orders.filter(o => String(o.id) !== String(deletingId));
    saveOrders(); // Lưu vào LocalStorage
    
    closeModal("modal-delete");
    alert("Заказ успешно удалён");
    renderOrders();
}

function bindEvents() {
    document.getElementById("orders-body")?.addEventListener("click", handleTableClick);
    document.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", handleModalClose));
    document.querySelectorAll(".modal").forEach((modal) => modal.addEventListener("click", handleOverlayClick));
    document.querySelectorAll('input[name="delivery_type"]').forEach((radio) => radio.addEventListener("change", handleDeliveryTypeChange));
    document.getElementById("edit-form")?.addEventListener("submit", handleEditSubmit);
    document.getElementById("confirm-delete")?.addEventListener("click", handleConfirmDelete);
}

document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    loadOrders(); // Khởi chạy
});