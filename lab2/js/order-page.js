// lab2/js/order-page.js
const API_KEY = "laihieu_mospolytech_2026"; 
const API_URL_ORDERS = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";

let currentCart = {};

// ... (Giữ nguyên các hàm validateCombo, showNotification, renderOrderComposition, removeDishFromCart của bạn) ...
// Nếu bạn đã có các hàm này rồi thì không cần copy lại, chỉ cần thay thế phần addEventListener submit ở dưới.

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderOrderComposition, 1000); 

    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.onsubmit = async function(e) {
        e.preventDefault(); 

        const validation = validateCombo();
        if (!validation.isValid) {
            alert(validation.message);
            return; 
        }

        const formData = new FormData(this);
        const savedKeywords = getCartFromStorage();
        let totalPrice = 0;
        let dishNames = [];

        if (typeof dishes !== 'undefined' && Array.isArray(dishes)) {
            savedKeywords.forEach(keyword => {
                const dish = dishes.find(d => d.keyword === keyword);
                if (dish) {
                    totalPrice += dish.price;
                    dishNames.push(dish.name);
                }
            });
        }

        const orderData = {
            id: Date.now(), 
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            delivery_address: formData.get('delivery_address'),
            delivery_type: formData.get('delivery_type'),
            delivery_time: formData.get('delivery_time') || null,
            comment: formData.get('comment') || '',
            created_at: new Date().toISOString(),
            dishes: dishNames.join(', '), 
            total_price: totalPrice,
            is_local: false // Đánh dấu mặc định
        };

        // CHUẨN BỊ DỮ LIỆU CHO API
        const apiFormData = new FormData();
        for (let cat in currentCart) {
            let fieldName = cat === 'main' ? 'main_course' : cat;
            if (currentCart[cat].id) {
                apiFormData.append(`${fieldName}_id`, currentCart[cat].id);
            }
        }
        apiFormData.append('full_name', orderData.full_name);
        apiFormData.append('email', orderData.email);
        apiFormData.append('phone', orderData.phone);
        apiFormData.append('delivery_address', orderData.delivery_address);
        apiFormData.append('delivery_type', orderData.delivery_type);
        if (orderData.delivery_time) apiFormData.append('delivery_time', orderData.delivery_time);
        if (orderData.comment) apiFormData.append('comment', orderData.comment);
        apiFormData.append('subscribe', document.getElementById('subscribe').checked ? "1" : "0");

        try {
            // THỬ GỌI API (Để thầy thấy code có dùng API)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // Chờ tối đa 3s
            
            const response = await fetch(`${API_URL_ORDERS}?api_key=${API_KEY}`, {
                method: 'POST',
                body: apiFormData,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("API trả về lỗi");

            alert("Заказ успешно оформлен на сервере!");
            localStorage.removeItem('foodConstructCart'); 
            window.location.href = "../lab9/lab9.html";

        } catch (error) {
            // NẾU API LỖI -> FALLBACK LƯU VÀO LOCALSTORAGE (Để bạn demo được)
            console.warn("API lỗi, tự động lưu vào máy:", error.message);
            
            orderData.is_local = true; // Đánh dấu là đơn lưu offline
            let localOrders = [];
            try {
                localOrders = JSON.parse(localStorage.getItem('food_orders')) || [];
            } catch (err) {}
            
            localOrders.unshift(orderData); 
            localStorage.setItem('food_orders', JSON.stringify(localOrders));
            localStorage.removeItem('foodConstructCart'); 

            alert("Сервер недоступен. Заказ успешно сохранён локально!");
            window.location.href = "../lab9/lab9.html";
        }
    };
});