// ==========================================
// LAB 6: VALIDATION & NOTIFICATIONS
// ==========================================

document.querySelector('.order-form').addEventListener('submit', function (event) {
    // Ngăn form gửi đi ngay lập tức để kiểm tra
    event.preventDefault();

    // Lấy trạng thái các món đã chọn
    const soup = selectedItems.soup;
    const main = selectedItems.main;
    const salad = selectedItems.salad;
    const drink = selectedItems.drink;
    const dessert = selectedItems.dessert;

    let errorMessage = "";

    // Logic kiểm tra dựa trên yêu cầu
    const count = [soup, main, salad, drink].filter(item => item !== null).length;

    if (count === 0 && !dessert) {
        errorMessage = "Ничего не выбрано. Выберите блюда для заказа";
    } else if (!soup && !main && !salad && (drink || dessert)) {
        errorMessage = "Выберите главное блюдо";
    } else if (!soup && !main && salad) {
        errorMessage = "Выберите суп или главное блюдо";
    } else if (soup && !main && !salad) {
        errorMessage = "Выберите главное блюдо/салат/стартер";
    } else if ((soup || main || salad) && !drink) {
        errorMessage = "Выберите напиток";
    }

    // Nếu có lỗi -> Hiện thông báo
    if (errorMessage !== "") {
        showNotification(errorMessage);
    } else {
        // Nếu hợp lệ -> Cho phép gửi form
        // (Vì chúng ta đã preventDefault, ta phải gọi submit() thủ công)
        this.submit();
    }
});

// Hàm tạo và hiển thị thông báo
function showNotification(message) {
    // Xóa thông báo cũ nếu có
    const oldNotification = document.querySelector('.notification-overlay');
    if (oldNotification) oldNotification.remove();

    // Tạo overlay (nền mờ)
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';

    // Tạo box thông báo
    const box = document.createElement('div');
    box.className = 'notification-box';

    // Nội dung thông báo
    const text = document.createElement('p');
    text.className = 'notification-text';
    text.textContent = message;

    // Nút OK
    const btn = document.createElement('button');
    btn.className = 'notification-btn';
    btn.textContent = 'Окей';

    // Sự kiện đóng thông báo
    btn.addEventListener('click', () => {
        overlay.remove();
    });

    // Ghép các phần tử
    box.appendChild(text);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}