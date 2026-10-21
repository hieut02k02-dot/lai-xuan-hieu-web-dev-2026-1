// Hàm tạo HTML cho 1 card món ăn
function createDishCard(dish) {
    return `
        <div class="dish" data-dish="${dish.keyword}" data-kind="${dish.kind}">
            <img src="${dish.image}" alt="${dish.name}">
            <p class="dish-price">${dish.price} ₽</p>
            <p class="dish-name">${dish.name}</p>
            <p class="dish-weight">${dish.count}</p>
            <button class="dish-button">Добавить</button>
        </div>
    `;
}

// Hàm render một danh mục
function renderSection(category) {
    const container = document.querySelector(`section[data-category="${category}"] .dishes`);
    if (!container) return;

    const filtered = dishes.filter(d => d.category === category);
    // Sắp xếp A-Z
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    filtered.forEach(dish => {
        container.insertAdjacentHTML('beforeend', createDishCard(dish));
    });
}

// Chạy render cho cả 5 danh mục
renderSection('soup');
renderSection('main');
renderSection('salad');
renderSection('drink');
renderSection('dessert');