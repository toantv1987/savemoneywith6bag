// Gallery & Lightbox
const initGallery = () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    
    // Tạo mảng các ảnh trong gallery
    const images = Array.from(galleryItems).map(item => {
        return {
            src: item.getAttribute('data-src'),
            alt: item.querySelector('img').getAttribute('alt')
        };
    });
    
    // Mở lightbox khi click vào ảnh
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            showImage(currentIndex);
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi lightbox đang mở
        });
    });
    
    // Đóng lightbox
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Cho phép cuộn trang trở lại
    });
    
    // Đóng lightbox khi click bên ngoài ảnh
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Hiển thị ảnh theo index
    function showImage(index) {
        lightboxImg.src = images[index].src;
        lightboxImg.alt = images[index].alt;
        lightboxCaption.innerHTML = images[index].alt;
        
        // Thêm hiệu ứng fade
        lightboxImg.classList.remove('fade');
        void lightboxImg.offsetWidth; // Trigger reflow
        lightboxImg.classList.add('fade');
    }
    
    // Next image
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });
    
    // Previous image
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            } else if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
};

// Thêm initGallery vào các hàm được gọi khi trang tải xong
window.addEventListener('DOMContentLoaded', () => {
    // Các hàm khác đã có
    navSlide();
    smoothScroll();
    validateForm();
    projectsCTA();
    activeNavOnScroll();
    initGallery(); // Thêm hàm khởi tạo gallery
    
    // Trigger skill bars animation when the skills section is in view
    const skillsSection = document.querySelector('#skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }
});