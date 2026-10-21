const dishes = [
    // ==========================================
    // 1. СУПЫ (6 món: 2 meat, 2 fish, 2 veg)
    // ==========================================
    { keyword: "pho-bo", name: "Фо Бо", price: 500, category: "soup", kind: "meat", count: "350 г", image: "images/soup1.jpg" },
    { keyword: "pho-ga", name: "Фо Га", price: 550, category: "soup", kind: "meat", count: "330 г", image: "images/soup2.jpg" },
    { keyword: "bun-bo-hue", name: "Бун Бо Хуэ", price: 600, category: "soup", kind: "meat", count: "330 г", image: "images/soup3.jpg" },
    { keyword: "canh-chua-ca", name: "Кань Чуа Ка", price: 480, category: "soup", kind: "fish", count: "350 г", image: "images/soup4.jpg" },
    { keyword: "sup-cua", name: "Суп Куа", price: 520, category: "soup", kind: "fish", count: "300 г", image: "images/soup5.jpg" },
    { keyword: "canh-rau", name: "Кань Рау", price: 350, category: "soup", kind: "veg", count: "300 г", image: "images/soup6.jpg" },

    // ==========================================
    // 2. ГЛАВНЫЕ БЛЮДА (6 món: 2 meat, 2 fish, 2 veg)
    // ==========================================
    { keyword: "com-tam", name: "Ком Там", price: 450, category: "main", kind: "meat", count: "250 г", image: "images/main1.jpg" },
    { keyword: "bun-cha", name: "Бун Ча", price: 480, category: "main", kind: "meat", count: "280 г", image: "images/main2.jpg" },
    { keyword: "thit-kho", name: "Тхит Кхо", price: 550, category: "main", kind: "meat", count: "300 г", image: "images/main3.jpg" },
    { keyword: "com-ca", name: "Ком Ка", price: 420, category: "main", kind: "fish", count: "250 г", image: "images/main4.jpg" },
    { keyword: "bun-ca", name: "Бун Ка", price: 450, category: "main", kind: "fish", count: "300 г", image: "images/main5.jpg" },
    { keyword: "pho-xao-rau", name: "Фо Шао Рау", price: 380, category: "main", kind: "veg", count: "300 г", image: "images/main6.jpg" },

    // ==========================================
    // 3. САЛАТЫ И СТАРТЕРЫ (6 món: 1 meat, 1 fish, 4 veg)
    // ==========================================
    { keyword: "goi-cuon", name: "Гой Куон", price: 350, category: "salad", kind: "meat", count: "200 г", image: "images/salad1.jpg" },
    { keyword: "nom-hoa-chuoi", name: "Ном Хоа Чуой", price: 280, category: "salad", kind: "fish", count: "180 г", image: "images/salad2.jpg" },
    { keyword: "goi-du-du", name: "Гой Ду Ду", price: 300, category: "salad", kind: "veg", count: "200 г", image: "images/salad3.jpg" },
    { keyword: "rau-muong", name: "Рау Муонг", price: 220, category: "salad", kind: "veg", count: "150 г", image: "images/salad4.jpg" },
    { keyword: "dau-hu-chien", name: "Дау Ху Чиен", price: 250, category: "salad", kind: "veg", count: "180 г", image: "images/salad5.jpg" },
    { keyword: "cha-gio", name: "Ча Зо", price: 320, category: "salad", kind: "veg", count: "200 г", image: "images/salad6.jpg" },

    // ==========================================
    // 4. НАПИТКИ (6 món: 3 cold, 3 hot)
    // ==========================================
    { keyword: "orange-juice", name: "Апельсиновый сок", price: 220, category: "drink", kind: "cold", count: "300 мл", image: "images/drink1.jpg" },
    { keyword: "carrot-juice", name: "Морковный сок", price: 310, category: "drink", kind: "cold", count: "300 мл", image: "images/drink2.jpg" },
    { keyword: "ca-phe-sua-da", name: "Ка Фе Шыа Да", price: 250, category: "drink", kind: "cold", count: "200 мл", image: "images/drink3.jpg" },
    { keyword: "lemon-tea", name: "Чай с лимоном", price: 200, category: "drink", kind: "hot", count: "300 мл", image: "images/drink4.jpg" },
    { keyword: "tra-gung", name: "Ча Зунг", price: 210, category: "drink", kind: "hot", count: "250 мл", image: "images/drink5.jpg" },
    { keyword: "ca-phe-nong", name: "Ка Фе Нонг", price: 230, category: "drink", kind: "hot", count: "150 мл", image: "images/drink6.jpg" },

    // ==========================================
    // 5. ДЕСЕРТЫ (6 món: 3 small, 2 medium, 1 large)
    // ==========================================
    { keyword: "banh-flan", name: "Бань Флан", price: 180, category: "dessert", kind: "small", count: "150 г", image: "images/dessert1.jpg" },
    { keyword: "che-ba-mau", name: "Че Ба Мау", price: 200, category: "dessert", kind: "small", count: "200 г", image: "images/dessert2.jpg" },
    { keyword: "banh-kem", name: "Бань Кем", price: 150, category: "dessert", kind: "small", count: "100 г", image: "images/dessert3.jpg" },
    { keyword: "banh-xeo", name: "Бань Шео", price: 320, category: "dessert", kind: "medium", count: "250 г", image: "images/dessert4.jpg" },
    { keyword: "che-thai", name: "Че Тхай", price: 250, category: "dessert", kind: "medium", count: "300 г", image: "images/dessert5.jpg" },
    { keyword: "banh-troi-nuoc", name: "Бань Чой Ныок", price: 380, category: "dessert", kind: "large", count: "400 г", image: "images/dessert6.jpg" }
];