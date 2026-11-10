const API_KEY = "https://edu.std-900.ist.mospolytech.ru"; 
const API_URL_ORDERS = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";

let currentCart = {}; // Object chứa thông tin chi tiết các món đang có

function validateCombo() {
    const s = currentCart.soup, m = currentCart.main, sa = currentCart.salad, d = currentCart.drink;
    const count = [s, m, sa, d].filter(item => item !== undefined).length;
    const hasDessert = currentCart.dessert !== undefined;

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

function renderOrderComposition() {
    const container = document.getElementById('order-composition');
    const savedKeywords = getCartFromStorage(); // Mảng các keyword
    let html = '';
    currentCart = {}; // Reset object chi tiết

    if (savedKeywords.length === 0) {
        container.innerHTML = '<p class="order-empty">Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="lab2.html">Собрать ланч</a>.</p>';
        document.getElementById('checkout-form').style.display = 'none';
        return;
    }

    document.getElementById('checkout-form').style.display = 'block';

    // Duyệt qua từng keyword đã lưu
    savedKeywords.forEach(keyword => {
        // Tìm món ăn trong mảng dishes toàn cục (được tải từ API)
        const dish = dishes.find(d => d.keyword === keyword);
        
        if (dish) {
            currentCart[dish.category] = dish; // Lưu lại object đầy đủ để tí nữa gửi server
            
            // Tạo ảnh an toàn (https)
            const secureImg = dish.image.replace('http://', 'https://');

            html += `
                <div class="dish" style="position: relative;">
                    <img src="${secureImg}" alt="${dish.name}" onerror="this.src='images/placeholder.jpg'">
                    <p class="dish-price">${dish.price} ₽</p>
                    <p class="dish-name">${dish.name}</p>
                    <button type="button" class="dish-button btn-delete" data-keyword="${dish.keyword}">Удалить</button>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;

    // Gắn sự kiện cho nút Xóa
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const keywordToRemove = e.target.getAttribute('data-keyword');
            removeDishFromCart(keywordToRemove);
        });
    });
}

// Hàm xóa món chuẩn xác
function removeDishFromCart(keywordToRemove) {
    let savedKeywords = getCartFromStorage();
    
    // Lọc bỏ keyword cần xóa ra khỏi mảng
    savedKeywords = savedKeywords.filter(kw => kw !== keywordToRemove);
    
    // Lưu lại mảng mới
    localStorage.setItem('foodConstructCart', JSON.stringify(savedKeywords));
    
    // Render lại
    renderOrderComposition(); 
}

document.getElementById('checkout-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const validation = validateCombo();
    if (!validation.isValid) {
        showNotification(validation.message);
        return; 
    }

    const formData = new FormData(this);
    
    // Gửi các ID món ăn
    for (let cat in currentCart) {
        formData.append(`${cat}_id`, currentCart[cat].keyword); 
    }

    try {
        // LƯU Ý: Bạn cần điền API_KEY thật vào biến ở trên
        const response = await fetch(API_URL_ORDERS + "?api_key=" + API_KEY, {
            method: 'POST',
            body: formData 
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.error || "Ошибка при отправке");

        alert("Заказ успешно оформлен!");
        clearCartStorage(); 
        window.location.href = "lab2.html";

    } catch (error) {
        // Vì bạn chưa có API_KEY nên nó sẽ nhảy vào đây (Lỗi Failed to fetch)
        showNotification("Ошибка сервера: " + error.message);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Đợi API tải xong dữ liệu thì mới render được
    setTimeout(renderOrderComposition, 1000); 
});