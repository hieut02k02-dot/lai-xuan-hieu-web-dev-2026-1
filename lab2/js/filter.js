// Lắng nghe sự kiện click trên toàn bộ trang
document.addEventListener('click', function(event) {
    // Kiểm tra xem có phải click vào nút filter không
    if (!event.target.classList.contains('filter-btn')) return;

    const clickedBtn = event.target;
    const parentFilters = clickedBtn.parentElement;
    const section = clickedBtn.closest('.menu-section');
    const dishesContainer = section.querySelector('.dishes');
    const allCards = dishesContainer.querySelectorAll('.dish');

    const isAlreadyActive = clickedBtn.classList.contains('active');

    // BƯỚC 1: Xóa class 'active' ở TẤT CẢ các nút trong cùng danh mục đó
    const allBtnsInSection = parentFilters.querySelectorAll('.filter-btn');
    allBtnsInSection.forEach(btn => btn.classList.remove('active'));

    // BƯỚC 2: Xử lý logic hiển thị
    if (isAlreadyActive) {
        // Nếu nút đã active từ trước (bấm lần 2 để bỏ chọn) -> Hiện tất cả
        allCards.forEach(card => card.style.display = 'flex');
    } else {
        // Nếu là nút mới được chọn
        clickedBtn.classList.add('active'); // Bật class active cho nút
        const targetKind = clickedBtn.getAttribute('data-kind');

        // Duyệt qua từng card món ăn
        allCards.forEach(card => {
            const cardKind = card.getAttribute('data-kind');
            if (cardKind === targetKind) {
                card.style.display = 'flex'; // Hiện món khớp
            } else {
                card.style.display = 'none'; // Ẩn món không khớp
            }
        });
    }
});