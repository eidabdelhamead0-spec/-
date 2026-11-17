/**
 * مخبز دَفَا المعادي - Dafa Bakery
 * ملف الجافاسكريبت التفاعلي (JS)
 */

document.addEventListener('DOMContentLoaded', () => {
    // رقم الواتساب للمخبز (يمكن تغييره لرقم المخبز الفعلي)
    const BAKERY_WHATSAPP_NUMBER = '201000000000';

    // =========================================================
    // 1. القائمة المتنقلة للموبايل (Mobile Menu)
    // =========================================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // إغلاق القائمة عند النقر على أي رابط
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // =========================================================
    // 2. تصفية المنتجات حسب التصنيف (Category Filter)
    // =========================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // تحديث الزر النشط
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // =========================================================
    // 3. نظام تجميع الطلب وإرساله عبر الواتساب (Order Tray & WhatsApp)
    // =========================================================
    let orderItems = [];
    const orderBox = document.getElementById('orderBox');
    const selectedCountText = document.getElementById('selectedCountText');
    const totalPriceEl = document.getElementById('totalPrice');
    const clearOrderBtn = document.getElementById('clearOrderBtn');
    const sendWhatsAppOrderBtn = document.getElementById('sendWhatsAppOrderBtn');
    const addButtons = document.querySelectorAll('.add-to-order-btn');

    // إضافة منتج للطلب
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            // فحص إذا كان العنصر موجوداً بالفعل لزيادة الكمية
            const existingItem = orderItems.find(item => item.id === id);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                orderItems.push({
                    id: id,
                    name: name,
                    price: price,
                    qty: 1
                });
            }

            // تأثير بصري للزر
            const originalHTML = btn.innerHTML;
            btn.classList.add('added');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> تمت الإضافة';

            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = originalHTML;
            }, 1200);

            updateOrderSummary();
        });
    });

    // تحديث شريط ملخص الطلب
    function updateOrderSummary() {
        if (!orderBox) return;

        const totalItemsCount = orderItems.reduce((acc, item) => acc + item.qty, 0);
        const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

        if (totalItemsCount > 0) {
            orderBox.classList.add('visible');
            selectedCountText.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'صنف مختار' : 'أصناف مختارة'}`;
            totalPriceEl.textContent = totalPrice;
        } else {
            orderBox.classList.remove('visible');
        }
    }

    // زر تفريغ الطلب
    if (clearOrderBtn) {
        clearOrderBtn.addEventListener('click', () => {
            orderItems = [];
            updateOrderSummary();
        });
    }

    // زر إرسال الطلب عبر واتساب
    if (sendWhatsAppOrderBtn) {
        sendWhatsAppOrderBtn.addEventListener('click', () => {
            if (orderItems.length === 0) return;

            let message = "🥖 *طلب جديد من مخبز دَفَا المعادي:*\n\n";
            orderItems.forEach((item, index) => {
                const subtotal = item.price * item.qty;
                message += `${index + 1}. *${item.name}* (الكمية: ${item.qty}) - ${subtotal} ج.م\n`;
            });

            const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
            message += `\n💰 *الإجمالي الكلي:* ${totalPrice} ج.م`;
            message += `\n📍 *عنوان التوصيل في المعادي:* (يرجى كتابة عنوانك بالتفصيل هنا)`;

            const encodedMessage = encodeURIComponent(message);
            const waUrl = `https://wa.me/${BAKERY_WHATSAPP_NUMBER}?text=${encodedMessage}`;

            window.open(waUrl, '_blank');
        });
    }

    // =========================================================
    // 4. تمييز روابط القائمة العلوية أثناء التمرير (Active Scroll Nav)
    // =========================================================
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    });
});
