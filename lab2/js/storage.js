// lab2/js/storage.js

// Lưu mảng các keyword vào localStorage
function saveCartToStorage(cart) {
    // Lấy ra các keyword của các món đang có (bỏ qua null)
    const keywords = [];
    for (let key in cart) {
        if (cart[key]) {
            keywords.push(cart[key].keyword);
        }
    }
    localStorage.setItem('foodConstructCart', JSON.stringify(keywords));
}

// Lấy mảng keyword từ localStorage
function getCartFromStorage() {
    const data = localStorage.getItem('foodConstructCart');
    return data ? JSON.parse(data) : [];
}

// Xóa sạch giỏ hàng
function clearCartStorage() {
    localStorage.removeItem('foodConstructCart');
}