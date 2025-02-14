document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-dots');

    // Criar pontos de navegação
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Função para atualizar classes dos slides
    const updateSlideClasses = () => {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            if (index === currentSlide) {
                slide.classList.add('active');
            } else if (index === getPrevIndex()) {
                slide.classList.add('prev');
            } else if (index === getNextIndex()) {
                slide.classList.add('next');
            }
        });
    };

    // Funções auxiliares para índices
    const getPrevIndex = () => {
        return (currentSlide - 1 + totalSlides) % totalSlides;
    };

    const getNextIndex = () => {
        return (currentSlide + 1) % totalSlides;
    };

    // Função para mover para um slide específico
    const moveToSlide = (targetIndex) => {
        if (targetIndex < 0) targetIndex = totalSlides - 1;
        if (targetIndex >= totalSlides) targetIndex = 0;

        currentSlide = targetIndex;
        
        // Atualizar classes dos slides
        updateSlideClasses();

        // Atualizar pontos de navegação
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Aplicar transformação ao track para deslizamento horizontal
        const offset = -currentSlide * 100;
        track.style.transform = `translateX(${offset}%)`;
    };

    // Event listeners para os botões
    nextButton.addEventListener('click', () => {
        moveToSlide(currentSlide + 1);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentSlide - 1);
    });

    // Event listeners para os pontos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
    });

    // Gestos de touch para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                moveToSlide(currentSlide + 1);
            } else {
                moveToSlide(currentSlide - 1);
            }
        }

        startAutoplay();
    });

    // Autoplay com intervalo maior para melhor visualização
    let autoplayInterval;
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            moveToSlide(currentSlide + 1);
        }, 6000); // Muda a cada 6 segundos
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    // Inicialização
    updateSlideClasses();
    startAutoplay();

    // Parar autoplay ao hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Teclas de seta
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            moveToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
            moveToSlide(currentSlide + 1);
        }
    });

    // Iniciar com o primeiro slide ativo
    moveToSlide(0);

    // Lazy loading das imagens
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('.carousel-slide img[data-src]');
        images.forEach(img => {
            if (img.getBoundingClientRect().top < window.innerHeight) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    };

    window.addEventListener('scroll', lazyLoadImages);
    lazyLoadImages();
}); 