/* ===== PETER'S PERFUMES — MAIN JS ===== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- LOADER --- */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 1200);
    });
    // Fallback in case load already fired
    if (document.readyState === 'complete') {
        setTimeout(() => loader.classList.add('hidden'), 1200);
    }

    /* --- CURSOR GLOW --- */
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    /* --- NAVBAR SCROLL --- */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        // back to top
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        lastScroll = scrollY;
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* --- HAMBURGER / MOBILE MENU --- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    /* --- ACTIVE NAV LINK ON SCROLL --- */
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-link');
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));

    /* --- SCROLL REVEAL ANIMATIONS --- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));

    /* --- COUNTER ANIMATION --- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;
    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    /* --- TESTIMONIALS SLIDER --- */
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('test-prev');
    const nextBtn = document.getElementById('test-next');
    let currentTest = 0;
    let autoSlideInterval;

    function setTestimonial(index) {
        testimonials.forEach((card, i) => {
            card.classList.remove('active');
            card.style.transform = i < index ? 'translateX(-60px)' : 'translateX(60px)';
            card.style.opacity = '0';
        });
        dots.forEach(dot => dot.classList.remove('active'));
        testimonials[index].classList.add('active');
        testimonials[index].style.transform = 'translateX(0)';
        testimonials[index].style.opacity = '1';
        dots[index].classList.add('active');
        currentTest = index;
    }

    function nextTestimonial() {
        setTestimonial((currentTest + 1) % testimonials.length);
    }
    function prevTestimonial() {
        setTestimonial((currentTest - 1 + testimonials.length) % testimonials.length);
    }

    nextBtn.addEventListener('click', () => {
        nextTestimonial();
        resetAutoSlide();
    });
    prevBtn.addEventListener('click', () => {
        prevTestimonial();
        resetAutoSlide();
    });
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            setTestimonial(i);
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextTestimonial, 5000);
    }
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    startAutoSlide();

    /* --- NEWSLETTER FORM --- */
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    const subscribeBtn = document.getElementById('subscribe-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (email) {
            subscribeBtn.innerHTML = '<span>SUBSCRIBED ✓</span>';
            subscribeBtn.style.background = '#16302B';
            subscribeBtn.style.color = '#fff';
            emailInput.value = '';
            setTimeout(() => {
                subscribeBtn.innerHTML = '<span>SUBSCRIBE</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
                subscribeBtn.style.background = '';
                subscribeBtn.style.color = '';
            }, 3000);
        }
    });

    /* --- SMOOTH ANCHOR SCROLL --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* --- PARALLAX ON HERO IMAGE --- */
    const heroImage = document.getElementById('hero-image');
    window.addEventListener('scroll', () => {
        if (heroImage) {
            const scrolled = window.scrollY;
            heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
        }
    });

    /* --- CARD TILT EFFECT --- */
    const cards = document.querySelectorAll('.collection-card, .bs-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* --- MAGNETIC BUTTONS --- */
    const magneticBtns = document.querySelectorAll('.btn-primary, .card-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* --- STAGGER COLLECTION CARDS --- */
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.15}s`;
    });

    const bsCards = document.querySelectorAll('.bs-card');
    bsCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.12}s`;
    });

    /* --- SCROLL INDICATOR HIDE --- */
    const scrollIndicator = document.getElementById('scroll-indicator');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200 && scrollIndicator) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '';
        }
    });

});
