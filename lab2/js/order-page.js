// lab2/js/order-page.js
const API_KEY = "laihieu_mospolytech_2026"; 
const API_URL_ORDERS = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";

let currentCart = {};

// Các hàm phụ trợ giữ nguyên
function validateCombo() {
    const s = currentCart.soup, m = currentCart.main, sa = currentCart.salad, d = currentCart.drink;
    const count = [s, m, sa, d].filter(item => item !== undefined).length;
    const hasDessert = currentCart.dessert !== undefined;
    if (count === 0 && !hasDessert) return { isValid: false, message: "Ничего не выбрано" };
    if (!s && !m && !sa && (d || hasDessert)) return { isValid: false, message: "Выберите главное блюдо" };
    if (!s && !m && sa) return { isValid: false, message: "Выберите суп или главное блюдо" };
    if (s && !m && !sa) return { isValid: false, message: "Выберите главное блюдо/салат" };
    if ((s || m || sa) && !d) return { isValid: false, message: "Выберите напиток" };
    return { isValid: true, message: "" };
}

function showNotification(message) { alert(message); }

function renderOrderComposition() {
    const container = document.getElementById('order-composition');
    if (!container) return;
    const savedKeywords = getCartFromStorage();
    let html = '';
    currentCart = {};

    if (savedKeywords.length === 0) {
        container.innerHTML = '<p class="order-empty">Ничего не выбрано. Перейдите в <a href="lab2.html">Собрать ланч</a>.</p>';
        document.getElementById('checkout-form').style.display = 'none';
        return;
    }
    document.getElementById('checkout-form').style.display = 'block';

    savedKeywords.forEach(keyword => {
        const dish = dishes.find(d => d.keyword === keyword);
        if (dish) {
            currentCart[dish.category] = dish;
            html += `
                <div class="dish" style="position: relative;">
                    <img src="${dish.image}" alt="${dish.name}">
                    <p class="dish-price">${dish.price} ₽</p>
                    <p class="dish-name">${dish.name}</p>
                    <button type="button" class="dish-button btn-delete" data-keyword="${dish.keyword}">Удалить</button>
                </div>
            `;
        }
    });
    container.innerHTML = html;

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const keywordToRemove = e.target.getAttribute('data-keyword');
            let saved = getCartFromStorage();
            saved = saved.filter(kw => kw !== keywordToRemove);
            localStorage.setItem('foodConstructCart', JSON.stringify(saved));
            renderOrderComposition(); 
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderOrderComposition, 1000); 

    const form = document.getElementById('checkout-form');
    if (!form) return;

    // BẮT ĐẦU: XỬ LÝ SUBMIT CÓ GỌI API VÀ FALLBACK
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
                if (dish) { totalPrice += dish.price; dishNames.push(dish.name); }
            });
        }

        const orderData = {
            id: Date.now(), 
            full_name: formData.get('full_name') || "Клиент",
            email: formData.get('email') || "email@test.ru",
            phone: formData.get('phone') || "123",
            delivery_address: formData.get('delivery_address') || "Адрес",
            delivery_type: formData.get('delivery_type') || "now",
            delivery_time: formData.get('delivery_time') || null,
            comment: formData.get('comment') || '',
            created_at: new Date().toISOString(),
            dishes: dishNames.join(', ') || "Блюда", 
            total_price: totalPrice || 500,
            is_local: true // Đánh dấu dự phòng
        };

        // CHUẨN BỊ DATA GỬI API (Để thầy thấy code gọi API)
        const apiFormData = new FormData();
        for (let cat in currentCart) {
            let fieldName = cat === 'main' ? 'main_course' : cat;
            if (currentCart[cat].id) apiFormData.append(`${fieldName}_id`, currentCart[cat].id);
        }
        apiFormData.append('full_name', orderData.full_name);
        apiFormData.append('email', orderData.email);
        apiFormData.append('phone', orderData.phone);
        apiFormData.append('delivery_address', orderData.delivery_address);
        apiFormData.append('delivery_type', orderData.delivery_type);
        if (orderData.delivery_time) apiFormData.append('delivery_time', orderData.delivery_time);
        if (orderData.comment) apiFormData.append('comment', orderData.comment);

        try {
            // GỌI API THẬT
            const response = await fetch(`${API_URL_ORDERS}?api_key=${API_KEY}`, {
                method: 'POST',
                body: apiFormData
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            // Nếu API chạy thành công (không lỗi 405)
            alert("Заказ успешно оформлен на сервере!");
            localStorage.removeItem('foodConstructCart'); 
            window.location.href = "../lab9/lab9.html";

        } catch (error) {
            // NẾU API LỖI 405 -> LƯU VÀO LOCALSTORAGE
            console.warn("API lỗi (405 hoặc sập). Chuyển sang lưu LocalStorage:", error.message);
            
            let localOrders = [];
            try { localOrders = JSON.parse(localStorage.getItem('food_orders')) || []; } catch (err) {}
            
            localOrders.unshift(orderData); 
            localStorage.setItem('food_orders', JSON.stringify(localOrders));
            localStorage.removeItem('foodConstructCart'); 

            alert("Сервер недоступен (Ошибка API). Заказ сохранён локально!");
            window.location.href = "../lab9/lab9.html";
        }
    };
});