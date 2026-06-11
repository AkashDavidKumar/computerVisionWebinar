/* 
========================================================================
   AI Tools for Teachers Webinar Registration System - Main Interactive Logics
   Author: Senior Full Stack Developer & Senior UI/UX Designer
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================================================
    // 1. PRELOADER SCREEN & SYSTEM LOAD
    // ========================================================================
    const loaderScreen = document.getElementById('loader-screen');
    if (loaderScreen) {
        window.addEventListener('load', () => {
            // Delay slightly for smooth initial animation
            setTimeout(() => {
                loaderScreen.classList.add('hidden');
            }, 600);
        });
    }

    // ========================================================================
    // 2. SCROLL PROGRESS INDICATOR & HEADER SHADOWS
    // ========================================================================
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const header = document.querySelector('header');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;

        // Update progress bar width
        if (scrollProgressBar) {
            scrollProgressBar.style.width = scrolled + '%';
        }

        // Update header shadow on scroll
        if (header) {
            if (scrollTop > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Floating Back-to-Top Button
        if (backToTopBtn) {
            if (scrollTop > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================================================
    // 3. DARK/LIGHT MODE TOGGLER WITH LOCAL STORAGE
    // ========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Check saved theme or system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Apply initial theme state
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                if (themeIcon) themeIcon.className = 'fas fa-moon';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) themeIcon.className = 'fas fa-sun';
            }
        });
    }

    // ========================================================================
    // 4. RESPONSIVE NAVIGATION MOBILE MENU
    // ========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && navMenu) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // ========================================================================
    // 5. ACCORDION FAQ DROPDOWNS
    // ========================================================================
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = trigger.nextElementSibling;
            
            // Check if active
            const isActive = item.classList.contains('active');

            // Close all active items
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
                const c = faqItem.querySelector('.faq-content');
                if (c) c.style.maxHeight = null;
            });

            // If it wasn't already active, open it
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // ========================================================================
    // 6. TESTIMONIALS SLIDER / AUTOMATED CAROUSEL
    // ========================================================================
    const carouselTrack = document.querySelector('.testimonials-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (carouselTrack && slides.length > 0) {
        let currentIndex = 0;
        let slideInterval;
        const slideCount = slides.length;

        // Generate dot elements based on slide counts
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoplay();
            });
            if (dotsContainer) dotsContainer.appendChild(dot);
        });

        const dots = Array.from(document.querySelectorAll('.carousel-dot'));

        function goToSlide(index) {
            currentIndex = index;
            // Shift translation offset
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dot classes
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function startAutoplay() {
            slideInterval = setInterval(() => {
                let nextIdx = (currentIndex + 1) % slideCount;
                goToSlide(nextIdx);
            }, 6000); // Transitions slide every 6 seconds
        }

        function resetAutoplay() {
            clearInterval(slideInterval);
            startAutoplay();
        }

        // Initialize Slider
        startAutoplay();
        
        // Touch support / swipe drag for mobile layout
        let startX = 0;
        let isSwiping = false;

        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            clearInterval(slideInterval);
        });

        carouselTrack.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const diffX = e.touches[0].clientX - startX;
            // Prevent scrolling page while sliding horizontally
            if (Math.abs(diffX) > 10) {
                e.preventDefault();
            }
        });

        carouselTrack.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            const diffX = e.changedTouches[0].clientX - startX;
            if (diffX > 50) {
                // Swipe right -> Prev slide
                let prevIdx = (currentIndex - 1 + slideCount) % slideCount;
                goToSlide(prevIdx);
            } else if (diffX < -50) {
                // Swipe left -> Next slide
                let nextIdx = (currentIndex + 1) % slideCount;
                goToSlide(nextIdx);
            }
            isSwiping = false;
            startAutoplay();
        });
    }

    // ========================================================================
    // 7. CERTIFICATE ZOOM PREVIEW MODAL
    // ========================================================================
    const certCard = document.getElementById('certificate-card');
    const modal = document.getElementById('cert-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-img');

    if (certCard && modal && modalClose) {
        certCard.addEventListener('click', () => {
            const previewImgSrc = certCard.getAttribute('data-preview');
            if (modalImg && previewImgSrc) {
                modalImg.src = previewImgSrc;
            }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background page scroll
        });

        const closeModalFunc = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        modalClose.addEventListener('click', closeModalFunc);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModalFunc();
            }
        });

        // Close on ESC keyboard key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModalFunc();
            }
        });
    }

    // Prevent dragging/copying of sample certificate preview images
    const secureImages = document.querySelectorAll('.cert-secure');
    secureImages.forEach(img => {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // ========================================================================
    // 8. PROGRAMMATIC DYNAMIC PARTICLE SPAWNER
    // ========================================================================
    const particleBg = document.querySelector('.particle-background');
    if (particleBg) {
        const particleCount = 12;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Randomize size, starting position, delay and duration
            const size = Math.floor(Math.random() * 100) + 50; // Size range: 50px - 150px
            const left = Math.random() * 100; // Position percentage
            const delay = Math.random() * 15; // Animation start delay in seconds
            const duration = Math.floor(Math.random() * 15) + 15; // Duration: 15s - 30s
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = left + '%';
            particle.style.animationDelay = delay + 's';
            particle.style.animationDuration = duration + 's';
            
            particleBg.appendChild(particle);
        }
    }
    
    // ========================================================================
    // 9. ANIMATED COUNTERS FOR STATS/OUTCOMES
    // ========================================================================
    const counterElements = document.querySelectorAll('.counter-val');
    if (counterElements.length > 0) {
        const observeCounters = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetVal = parseInt(el.getAttribute('data-target'));
                    let currentVal = 0;
                    const speed = 2000 / targetVal; // Animate over 2 seconds
                    
                    const updateVal = () => {
                        currentVal += Math.ceil(targetVal / 100);
                        if (currentVal >= targetVal) {
                            el.textContent = targetVal + (el.getAttribute('data-suffix') || '');
                        } else {
                            el.textContent = currentVal + (el.getAttribute('data-suffix') || '');
                            setTimeout(updateVal, speed);
                        }
                    };
                    
                    updateVal();
                    observer.unobserve(el); // Animate only once
                }
            });
        }, { threshold: 0.5 });
        
        counterElements.forEach(el => observeCounters.observe(el));
    }

    // ========================================================================
    // 10. GRAND BUTTON CLICK SHOCKWAVE & PARTICLE BURST ANIMATIONS
    // ========================================================================
    // Inject dynamic CSS rules for particles and shockwave rings
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .click-shockwave {
            position: fixed;
            border: 3px solid var(--accent, #fbbf24);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
            transition: transform 0.6s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.6s cubic-bezier(0.1, 0.8, 0.3, 1);
        }
        .click-particle {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            transition: transform 0.7s cubic-bezier(0.15, 0.85, 0.35, 1), opacity 0.7s cubic-bezier(0.15, 0.85, 0.35, 1), width 0.7s ease, height 0.7s ease;
        }
        /* Active button shrink effect */
        .btn:active {
            transform: scale(0.95) !important;
            transition: transform 0.1s ease !important;
        }
    `;
    document.head.appendChild(styleEl);

    // Global listener for all primary and secondary button click interactions
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn');
        if (!btn) return;
        
        // Check if button is an anchor link that redirects to another page (not scroll anchor or new tab)
        const href = btn.getAttribute('href');
        const target = btn.getAttribute('target');
        let shouldDelayRedirect = false;
        
        if (btn.tagName === 'A' && href && !href.startsWith('#') && !href.startsWith('javascript:') && target !== '_blank') {
            shouldDelayRedirect = true;
            e.preventDefault();
        }
        
        // Spawn locations based on page client click coordinates
        const x = e.clientX;
        const y = e.clientY;
        
        // 1. Spawning Expanding Shockwave Ring
        const shockwave = document.createElement('div');
        shockwave.classList.add('click-shockwave');
        shockwave.style.left = x + 'px';
        shockwave.style.top = y + 'px';
        shockwave.style.width = '20px';
        shockwave.style.height = '20px';
        document.body.appendChild(shockwave);
        
        // Animate scale in next rendering frame
        requestAnimationFrame(() => {
            shockwave.style.transform = 'translate(-50%, -50%) scale(5)';
            shockwave.style.opacity = '0';
        });
        
        // 2. Spawning glowing neon particle explosions
        const particleCount = 12;
        const colors = ['#1d4ed8', '#fbbf24', '#15803d', '#38bdf8', '#ff3366'];
        
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.classList.add('click-particle');
            
            // Random physics (size, colors, velocity, angles)
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.floor(Math.random() * 8) + 6; // Range: 6px - 14px
            const angle = Math.random() * Math.PI * 2; // Full 360 degree circle
            const velocity = Math.random() * 80 + 40; // Travel distance
            const targetX = Math.cos(angle) * velocity;
            const targetY = Math.sin(angle) * velocity;
            
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.backgroundColor = color;
            p.style.boxShadow = `0 0 12px ${color}`;
            
            document.body.appendChild(p);
            
            // Trigger animation frame displacements
            requestAnimationFrame(() => {
                p.style.transform = `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(0)`;
                p.style.opacity = '0';
            });
        }
        
        // 3. Clean up DOM elements and handle deferred redirection
        setTimeout(() => {
            shockwave.remove();
            // Remove particles belonging to this click
            document.querySelectorAll('.click-particle').forEach(p => {
                if (p.style.opacity === '0') p.remove();
            });
            
            // If redirect was deferred, perform it now!
            if (shouldDelayRedirect) {
                window.location.href = href;
            }
        }, 500); // 500ms delay matches particle fade out sweet spot perfectly
    });

    // ========================================================================
    // FIXED PRICING ENGINE (₹49 Fee)
    // ========================================================================
    (function() {
        const price = 49;
        
        // 1. Update text elements with price values
        const priceElements = document.querySelectorAll('.dynamic-price-text');
        priceElements.forEach(el => {
            el.textContent = '₹' + price;
        });
        
        // 2. Update UPI payment deep links (amount parameter 'am')
        const payLinks = document.querySelectorAll('.dynamic-upi-pay-link');
        payLinks.forEach(link => {
            let href = link.getAttribute('href');
            if (href) {
                // Replace am=49 or other price value dynamically
                href = href.replace(/am=\d+/, 'am=' + price);
                link.setAttribute('href', href);
            }
            
            let title = link.getAttribute('title');
            if (title) {
                // Replace title description price
                title = title.replace(/₹\d+/, '₹' + price);
                link.setAttribute('title', title);
            }
            
            // If it's the green UPI deep-link button, update its text too
            if (link.classList.contains('upi-pay-btn')) {
                link.innerHTML = `<i class="fas fa-wallet"></i> Pay ₹${price} via UPI App (Mobile Only)`;
            }
        });

        // 3. Update QR code image based on price (₹39 QR vs default ₹40 fallback QR)
        const qrImg = document.querySelector('.qr-image');
        if (qrImg) {
            if (price === 39) {
                qrImg.setAttribute('src', 'images/payment_QR_39rs.jpeg');
            } else {
                qrImg.setAttribute('src', 'images/Payment_QR_Cropped-49rs.jpeg');
            }
        }
    })();
});
