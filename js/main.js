document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const menuButton = document.querySelector('.menu-button');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Fechar menu ao clicar em um link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuButton.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Adiciona classe quando rola
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Esconde/mostra header baseado na direção do scroll
        if (currentScroll <= 0) {
            header.style.transform = 'translateY(0)';
        } else if (currentScroll > lastScroll) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll com offset do header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = header.offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação de fade-in para elementos
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('credentials')) {
                    entry.target.querySelectorAll('li').forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Elementos para animar
    const animatedElements = document.querySelectorAll(
        '.hero-content, .about-content, .service-card, .timeline-item, .credentials, .contact-form, .contact-info'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });

    // Parallax suave no background
    const backgroundWrapper = document.querySelector('.background-wrapper');
    if (backgroundWrapper) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            backgroundWrapper.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    }

    // Formulário de contato com validação e feedback visual
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Efeito de foco
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                validateInput(input);
            });

            // Validação em tempo real
            input.addEventListener('input', () => {
                validateInput(input);
            });
        });

        function validateInput(input) {
            const errorClass = 'error';
            const validClass = 'valid';
            
            if (input.value.trim() === '') {
                input.classList.add(errorClass);
                input.classList.remove(validClass);
                return false;
            }

            if (input.type === 'email' && !validateEmail(input.value)) {
                input.classList.add(errorClass);
                input.classList.remove(validClass);
                return false;
            }

            if (input.type === 'tel' && !validatePhone(input.value)) {
                input.classList.add(errorClass);
                input.classList.remove(validClass);
                return false;
            }

            input.classList.remove(errorClass);
            input.classList.add(validClass);
            return true;
        }

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function validatePhone(phone) {
            return /^[\d\s()-]+$/.test(phone);
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showNotification('Por favor, preencha todos os campos corretamente.', 'error');
                return;
            }

            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            // Simulação de envio
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                this.reset();
                inputs.forEach(input => {
                    input.classList.remove('valid');
                });
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Efeito de hover nos cards de serviço
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            serviceCards.forEach(c => c.classList.add('card-blur'));
            card.classList.remove('card-blur');
        });
        
        card.addEventListener('mouseleave', () => {
            serviceCards.forEach(c => c.classList.remove('card-blur'));
        });
    });
}); 