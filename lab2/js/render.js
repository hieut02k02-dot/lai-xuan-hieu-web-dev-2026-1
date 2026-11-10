// Hàm tạo HTML cho 1 card món ăn (Giữ nguyên)
function createDishCard(dish) {
    return `
        <div class="dish" data-dish="${dish.keyword}" data-kind="${dish.kind}">
            <img src="${dish.image.replace('http://', 'https://')}" alt="${dish.name}">
            <p class="dish-price">${dish.price} ₽</p>
            <p class="dish-name">${dish.name}</p>
            <p class="dish-weight">${dish.count}</p>
            <button class="dish-button">Добавить</button>
        </div>
    `;
}

// Hàm render một danh mục (Giữ nguyên)
function renderSection(category) {
    const container = document.querySelector(`section[data-category="${category}"] .dishes`);
    if (!container) return;

    // Xóa nội dung cũ (nếu có) trước khi vẽ mới
    container.innerHTML = '';

    const filtered = dishes.filter(d => d.category === category);
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    filtered.forEach(dish => {
        container.insertAdjacentHTML('beforeend', createDishCard(dish));
    });
}


// HÀM MỚI CỦA LAB 7: Tải dữ liệu từ API (Kèm dự phòng 30 món)
async function loadDishes() {
    const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

    // Dữ liệu mẫu 30 món (giống hệt Lab 5)
    const mockData = [
        // 1. СУПЫ
        { category: "soup", count: "350 г", image: "images/soup1.jpg", keyword: "pho-bo", kind: "meat", name: "Фо Бо", price: 500 },
        { category: "soup", count: "330 г", image: "images/soup2.jpg", keyword: "pho-ga", kind: "meat", name: "Фо Га", price: 550 },
        { category: "soup", count: "330 г", image: "images/soup3.jpg", keyword: "bun-bo-hue", kind: "meat", name: "Бун Бо Хуэ", price: 600 },
        { category: "soup", count: "350 г", image: "images/soup4.jpg", keyword: "canh-chua-ca", kind: "fish", name: "Кань Чуа Ка", price: 480 },
        { category: "soup", count: "300 г", image: "images/soup5.jpg", keyword: "sup-cua", kind: "fish", name: "Суп Куа", price: 520 },
        { category: "soup", count: "300 г", image: "images/soup6.jpg", keyword: "canh-rau", kind: "veg", name: "Кань Рау", price: 350 },

        // 2. ГЛАВНЫЕ БЛЮДА
        { category: "main", count: "250 г", image: "images/main1.jpg", keyword: "com-tam", kind: "meat", name: "Ком Там", price: 450 },
        { category: "main", count: "280 г", image: "images/main2.jpg", keyword: "bun-cha", kind: "meat", name: "Бун Ча", price: 480 },
        { category: "main", count: "300 г", image: "images/main3.jpg", keyword: "thit-kho", kind: "meat", name: "Тхит Кхо", price: 550 },
        { category: "main", count: "250 г", image: "images/main4.jpg", keyword: "com-ca", kind: "fish", name: "Ком Ка", price: 420 },
        { category: "main", count: "300 г", image: "images/main5.jpg", keyword: "bun-ca", kind: "fish", name: "Бун Ка", price: 450 },
        { category: "main", count: "300 г", image: "images/main6.jpg", keyword: "pho-xao-rau", kind: "veg", name: "Фо Шао Рау", price: 380 },

        // 3. САЛАТЫ И СТАРТЕРЫ
        { category: "salad", count: "200 г", image: "images/salad1.jpg", keyword: "goi-cuon", kind: "meat", name: "Гой Куон", price: 350 },
        { category: "salad", count: "180 г", image: "images/salad2.jpg", keyword: "nom-hoa-chuoi", kind: "fish", name: "Ном Хоа Чуой", price: 280 },
        { category: "salad", count: "200 г", image: "images/salad3.jpg", keyword: "goi-du-du", kind: "veg", name: "Гой Ду Ду", price: 300 },
        { category: "salad", count: "150 г", image: "images/salad4.jpg", keyword: "rau-muong", kind: "veg", name: "Рау Муонг", price: 220 },
        { category: "salad", count: "180 г", image: "images/salad5.jpg", keyword: "dau-hu-chien", kind: "veg", name: "Дау Ху Чиен", price: 250 },
        { category: "salad", count: "200 г", image: "images/salad6.jpg", keyword: "cha-gio", kind: "veg", name: "Ча Зо", price: 320 },

        // 4. НАПИТКИ
        { category: "drink", count: "300 мл", image: "images/drink1.jpg", keyword: "orange-juice", kind: "cold", name: "Апельсиновый сок", price: 220 },
        { category: "drink", count: "300 мл", image: "images/drink2.jpg", keyword: "carrot-juice", kind: "cold", name: "Морковный сок", price: 310 },
        { category: "drink", count: "200 мл", image: "images/drink3.jpg", keyword: "ca-phe-sua-da", kind: "cold", name: "Ка Фе Шыа Да", price: 250 },
        { category: "drink", count: "300 мл", image: "images/drink4.jpg", keyword: "lemon-tea", kind: "hot", name: "Чай с лимоном", price: 200 },
        { category: "drink", count: "250 мл", image: "images/drink5.jpg", keyword: "tra-gung", kind: "hot", name: "Ча Зунг", price: 210 },
        { category: "drink", count: "150 мл", image: "images/drink6.jpg", keyword: "ca-phe-nong", kind: "hot", name: "Ка Фе Нонг", price: 230 },

        // 5. ДЕСЕРТЫ
        { category: "dessert", count: "150 г", image: "images/dessert1.jpg", keyword: "banh-flan", kind: "small", name: "Бань Флан", price: 180 },
        { category: "dessert", count: "200 г", image: "images/dessert2.jpg", keyword: "che-ba-mau", kind: "small", name: "Че Ба Мау", price: 200 },
        { category: "dessert", count: "100 г", image: "images/dessert3.jpg", keyword: "banh-kem", kind: "small", name: "Бань Кем", price: 150 },
        { category: "dessert", count: "250 г", image: "images/dessert4.jpg", keyword: "banh-xeo", kind: "medium", name: "Бань Шео", price: 320 },
        { category: "dessert", count: "300 г", image: "images/dessert5.jpg", keyword: "che-thai", kind: "medium", name: "Че Тхай", price: 250 },
        { category: "dessert", count: "400 г", image: "images/dessert6.jpg", keyword: "banh-troi-nuoc", kind: "large", name: "Бань Чой Ныок", price: 380 }
    ];

    try {
        // Gửi request GET đến API
        const response = await fetch(API_URL);
        
        // Kiểm tra xem request có thành công không
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        // Chuyển dữ liệu nhận được thành JSON
        dishes = await response.json();
        console.log("Данные успешно загружены с реального API!");

    } catch (error) {
        // NẾU API LỖI (như 502), TỰ ĐỘNG CHUYỂN SANG DÙNG 30 MÓN MẪU
        console.warn("Сервер API недоступен (502). Используем резервные данные для демонстрации.", error);
        dishes = mockData;
    }

    // Sau khi có dữ liệu, tiến hành vẽ giao diện cho cả 5 danh mục
    renderSection('soup');
    renderSection('main');
    renderSection('salad');
    renderSection('drink');
    renderSection('dessert');
}

// Chạy hàm tải dữ liệu ngay khi trang web mở
loadDishes();