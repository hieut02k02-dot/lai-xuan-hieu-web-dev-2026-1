// Mở rộng thêm 2 thuộc tính cho Salad và Dessert
const selectedItems = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

const categoryTitles = {
    soup: "Суп",
    main: "Главное блюдо",
    salad: "Салат или стартер",
    drink: "Напиток",
    dessert: "Десерт"
};

function updateOrderBlock() {
    const listContainer = document.getElementById('order-list');
    const costContainer = document.getElementById('order-cost');
    const costValue = document.getElementById('cost-value');

    const hasAnyItem = selectedItems.soup || selectedItems.main || selectedItems.salad || selectedItems.drink || selectedItems.dessert;

    if (!hasAnyItem) {
        listContainer.innerHTML = '<p class="order-empty">Ничего не выбрано</p>';
        costContainer.style.display = 'none';
        
        // Reset tất cả input ẩn
        document.getElementById('hidden-soup').value = '';
        document.getElementById('hidden-main').value = '';
        document.getElementById('hidden-salad').value = '';
        document.getElementById('hidden-drink').value = '';
        document.getElementById('hidden-dessert').value = '';
        return;
    }

    let html = '';
    let totalCost = 0;

    // Duyệt qua 5 danh mục
    ['soup', 'main', 'salad', 'drink', 'dessert'].forEach(category => {
        const item = selectedItems[category];
        
        if (item) {
            totalCost += item.price;
            html += `
                <div class="order-item">
                    <span class="order-category">${categoryTitles[category]}:</span>
                    <span class="order-name">${item.name}</span>
                    <span class="order-price">${item.price} ₽</span>
                </div>
            `;
        } else {
            // Text cho danh mục trống
            let emptyText = 'Блюдо не выбрано';
            if (category === 'drink') emptyText = 'Напиток не выбран';
            if (category === 'dessert') emptyText = 'Десерт не выбран';
            if (category === 'salad') emptyText = 'Салат не выбран';

            html += `
                <div class="order-item order-item--empty">
                    <span class="order-category">${categoryTitles[category]}:</span>
                    <span class="order-name">${emptyText}</span>
                </div>
            `;
        }
    });

    listContainer.innerHTML = html;
    costContainer.style.display = 'flex';
    costValue.textContent = totalCost + ' ₽';

    // Ghi keyword vào các input ẩn
    document.getElementById('hidden-soup').value = selectedItems.soup ? selectedItems.soup.keyword : '';
    document.getElementById('hidden-main').value = selectedItems.main ? selectedItems.main.keyword : '';
    document.getElementById('hidden-salad').value = selectedItems.salad ? selectedItems.salad.keyword : '';
    document.getElementById('hidden-drink').value = selectedItems.drink ? selectedItems.drink.keyword : '';
    document.getElementById('hidden-dessert').value = selectedItems.dessert ? selectedItems.dessert.keyword : '';
}

document.addEventListener('click', function(event) {
    // Chỉ xử lý khi click vào nút "Добавить"
    if (!event.target.classList.contains('dish-button')) return;

    const card = event.target.closest('.dish');
    const keyword = card.getAttribute('data-dish');

    // Tìm món trong mảng data.js
    const dish = dishes.find(d => d.keyword === keyword);
    if (!dish) return;

    // Lưu vào danh mục (soup, main, salad...)
    selectedItems[dish.category] = dish;

    // Xóa viền đỏ ở các card cùng danh mục
    document.querySelectorAll(`.dish`).forEach(c => {
        const cDish = dishes.find(d => d.keyword === c.getAttribute('data-dish'));
        if (cDish && cDish.category === dish.category) {
            c.classList.remove('dish--selected');
        }
    });

    // Thêm viền đỏ cho card vừa chọn
    card.classList.add('dish--selected');

    // Cập nhật form
    updateOrderBlock();
});

// Xử lý nút Reset form
document.querySelector('.order-form').addEventListener('reset', function() {
    // Reset dữ liệu mảng
    selectedItems.soup = null;
    selectedItems.main = null;
    selectedItems.salad = null;
    selectedItems.drink = null;
    selectedItems.dessert = null;
    
    // Xóa viền đỏ ở tất cả card
    document.querySelectorAll('.dish').forEach(c => c.classList.remove('dish--selected'));
    
    updateOrderBlock();
});

// Khởi chạy lần đầu
updateOrderBlock();