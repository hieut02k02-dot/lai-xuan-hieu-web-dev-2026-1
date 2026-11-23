// lab2/js/order-page.js
let currentCart = {};

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

function showNotification(message) {
    alert(message);
}

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

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Chặn gửi API

        const validation = validateCombo();
        if (!validation.isValid) {
            alert(validation.message);
            return; 
        }

        const formData = new FormData(this);
        const savedKeywords = getCartFromStorage();
        let totalPrice = 0;
        let dishNames = [];

        savedKeywords.forEach(keyword => {
            const dish = dishes.find(d => d.keyword === keyword);
            if (dish) {
                totalPrice += dish.price;
                dishNames.push(dish.name);
            }
        });

        // TẠO ĐƠN HÀNG
        const newOrder = {
            id: Date.now(), // Tạo ID duy nhất
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            delivery_address: formData.get('delivery_address'),
            delivery_type: formData.get('delivery_type'),
            delivery_time: formData.get('delivery_time') || null,
            comment: formData.get('comment') || '',
            created_at: new Date().toISOString(),
            dishes: dishNames.join(', '), 
            total_price: totalPrice
        };

        // LƯU VÀO LOCALSTORAGE
        let orders = [];
        try {
            orders = JSON.parse(localStorage.getItem('food_orders')) || [];
        } catch (err) {
            orders = [];
        }
        
        orders.unshift(newOrder); 
        if (orders.length > 10) orders = orders.slice(0, 10); // Giới hạn 10 đơn
        
        localStorage.setItem('food_orders', JSON.stringify(orders));

        // Xóa giỏ hàng
        localStorage.removeItem('foodConstructCart'); 

        alert("Заказ успешно оформлен!");
        window.location.href = "../lab9/lab9.html"; // Chuyển sang Lab 9
    });
});