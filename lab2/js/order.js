// lab2/js/order.js

const selectedItems = { soup: null, main: null, salad: null, drink: null, dessert: null };

function validateCombo() {
    const s = selectedItems.soup, m = selectedItems.main, sa = selectedItems.salad, d = selectedItems.drink;
    const count = [s, m, sa, d].filter(item => item !== null).length;
    const hasDessert = selectedItems.dessert !== null;

    if (count === 0 && !hasDessert) return { isValid: false, message: "Ничего не выбрано. Выберите блюда для заказа" };
    if (!s && !m && !sa && (d || hasDessert)) return { isValid: false, message: "Выберите главное блюдо" };
    if (!s && !m && sa) return { isValid: false, message: "Выберите суп или главное блюдо" };
    if (s && !m && !sa) return { isValid: false, message: "Выберите главное блюдо/салат/стартер" };
    if ((s || m || sa) && !d) return { isValid: false, message: "Выберите напиток" };
    
    return { isValid: true, message: "" };
}

function showNotification(message) {
    const oldNotification = document.querySelector('.notification-overlay');
    if (oldNotification) oldNotification.remove();

    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    const box = document.createElement('div');
    box.className = 'notification-box';
    const text = document.createElement('p');
    text.className = 'notification-text';
    text.textContent = message;
    const btn = document.createElement('button');
    btn.className = 'notification-btn';
    btn.textContent = 'Окей';
    
    btn.addEventListener('click', () => overlay.remove());
    box.appendChild(text);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function updateOrderPanel() {
    const panel = document.getElementById('order-panel');
    const costDisplay = document.getElementById('panel-cost');
    const checkoutBtn = document.getElementById('checkout-btn');

    let totalCost = 0;
    let hasItems = false;

    for (let key in selectedItems) {
        if (selectedItems[key]) {
            totalCost += selectedItems[key].price;
            hasItems = true;
        }
    }

    if (hasItems) {
        panel.style.display = 'block';
        costDisplay.textContent = totalCost + ' ₽';
        
        const validation = validateCombo();
        if (validation.isValid) {
            checkoutBtn.classList.remove('disabled');
            checkoutBtn.style.pointerEvents = 'auto';
        } else {
            checkoutBtn.classList.add('disabled');
            checkoutBtn.style.pointerEvents = 'none';
        }
    } else {
        panel.style.display = 'none';
    }
}

// Hàm khôi phục giao diện (Highlight viền đỏ) dựa trên mảng keyword
function restoreSelectionUI() {
    // Xóa hết viền đỏ cũ trước
    document.querySelectorAll('.dish').forEach(c => c.classList.remove('dish--selected'));
    
    // Duyệt qua selectedItems, nếu có món nào thì tìm thẻ div tương ứng và bôi đỏ
    for (let key in selectedItems) {
        if (selectedItems[key]) {
            const card = document.querySelector(`.dish[data-dish="${selectedItems[key].keyword}"]`);
            if (card) card.classList.add('dish--selected');
        }
    }
    updateOrderPanel();
}

// Hàm khởi tạo / Đồng bộ dữ liệu từ LocalStorage
function syncDataFromStorage() {
    // Lấy mảng keyword từ LocalStorage (ví dụ: ["pho-bo", "com-tam"])
    const savedKeywords = getCartFromStorage(); 

    // Reset lại object selectedItems
    for (let key in selectedItems) {
        selectedItems[key] = null;
    }

    // Nếu có dữ liệu lưu, tìm lại object món ăn trong mảng `dishes` (từ API) để gán lại
    savedKeywords.forEach(keyword => {
        const dish = dishes.find(d => d.keyword === keyword);
        if (dish) {
            selectedItems[dish.category] = dish;
        }
    });

    // Cập nhật lại giao diện (viền đỏ + Panel)
    restoreSelectionUI();
}

// Bắt sự kiện click chọn món
document.addEventListener('click', function(event) {
    if (!event.target.classList.contains('dish-button')) return;

    const card = event.target.closest('.dish');
    const keyword = card.getAttribute('data-dish');
    const dish = dishes.find(d => d.keyword === keyword);
    if (!dish) return;

    // Cập nhật món mới vào danh mục tương ứng (ghi đè món cũ nếu có)
    selectedItems[dish.category] = dish;

    // Lưu TOÀN BỘ selectedItems mới vào LocalStorage (ghi đè hoàn toàn)
    saveCartToStorage(selectedItems); 
    
    // Cập nhật giao diện
    restoreSelectionUI();
});

// LẮNG NGHE SỰ KIỆN KHI TRÌNH DUYỆT TẢI LẠI TRANG (KỂ CẢ KHI BẤM NÚT BACK)
window.addEventListener('pageshow', function(event) {
    // Nếu trang được tải từ cache (bấm nút Back), hoặc mới tải lần đầu
    // Chờ 1 chút để API tải xong dữ liệu dishes
    setTimeout(syncDataFromStorage, 800); 
});

// Đề phòng trường hợp API tải chậm, cập nhật thêm sau 2 giây
setTimeout(syncDataFromStorage, 2000);