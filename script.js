/* ========================================
   COLLECT TWEAK - Main JavaScript
   Senior Dev Level - Production Ready
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── X. ACCESSIBILITY: REDUCED MOTION ──
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 0. CURSOR RING FOLLOWER ──
    const cursorRing = document.getElementById('cursor-ring');
    if (cursorRing) {
        let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => { 
            mouseX = e.clientX; 
            mouseY = e.clientY; 
        });
        (function lerp() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
            requestAnimationFrame(lerp);
        })();
    }

    // ── 1. LENIS SMOOTH SCROLL ──
    let lenis;
    if (!prefersReducedMotion) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ── 2. GSAP SCROLL ANIMATIONS ──
    gsap.registerPlugin(ScrollTrigger);

    // Animate all major sections on scroll
    gsap.utils.toArray('section, .section-subheading').forEach((el) => {
        gsap.from(el, {
            opacity: prefersReducedMotion ? 1 : 0,
            y: prefersReducedMotion ? 0 : 40,
            duration: prefersReducedMotion ? 0 : 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
        });
    });

    // Hero: no GSAP entrance animation to avoid re-play bug on navigation

    // Dashboard showcase parallax
    const dashboard = document.getElementById('exmDashboard');
    if (dashboard) {
        gsap.from(dashboard, {
            opacity: 0,
            scale: 0.92,
            y: 60,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: dashboard,
                start: 'top 80%',
            },
        });
    }

    // ── 3. BEFORE/AFTER SLIDER ──
    const sliderInput = document.getElementById('slider-input');
    const sliderAfter = document.querySelector('.slider-image-after');
    const sliderHandle = document.getElementById('slider-handle');

    if (sliderInput && sliderAfter && sliderHandle) {
        sliderInput.addEventListener('input', (e) => {
            const val = e.target.value;
            sliderAfter.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
            sliderHandle.style.left = `${val}%`;
        });
    }

    // ── 4. SWIPER CAROUSELS ──
    const initSwipers = () => {
        const swiperContainers = document.querySelectorAll('.swiper[data-carousel-id]');
        
        swiperContainers.forEach(container => {
            const carouselId = container.getAttribute('data-carousel-id');
            const nextBtn = document.querySelector(`.custom-nav-next[data-carousel-id="${carouselId}"]`);
            const prevBtn = document.querySelector(`.custom-nav-prev[data-carousel-id="${carouselId}"]`);

            new Swiper(container, {
                slidesPerView: 1.2,
                spaceBetween: 20,
                grabCursor: true,
                watchOverflow: true,
                breakpoints: {
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.2 },
                },
                navigation: {
                    nextEl: nextBtn,
                    prevEl: prevBtn,
                },
            });
        });
    }

    initSwipers();

    // ── 5. NAV SCROLL EFFECT ──
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                nav.classList.add('bg-[#050505]/90', 'backdrop-blur-lg', 'shadow-lg');
                nav.style.borderBottom = '1px solid rgba(144,72,253,0.15)';
            } else {
                nav.classList.remove('bg-[#050505]/90', 'backdrop-blur-lg', 'shadow-lg');
                nav.style.borderBottom = 'none';
            }
        });
    }

    // ── 6. MOBILE MENU TOGGLE ──
    const toggleBtn = document.getElementById('toggle-menu');
    const navbar = document.getElementById('navbar-cta');
    if (toggleBtn && navbar) {
        toggleBtn.addEventListener('click', () => {
            navbar.classList.toggle('is-open');
        });
    }

    // ── 7. SMOOTH ANCHOR SCROLLING ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                if (lenis) {
                    lenis.scrollTo(target, { offset: -80 });
                } else {
                    window.scrollTo({ top: target.offsetTop - 80, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                }
    // Close mobile menu if open
                if (navbar) navbar.classList.remove('is-open');
            }
        });
    });

    // ── 10. AUTH STATE SYNC ──
    const syncAuth = () => {
        const authZone = document.getElementById('auth-zone');
        const userStr = localStorage.getItem('collect_user');
        if (!authZone || !userStr) return;

        try {
            const user = JSON.parse(userStr);
            authZone.innerHTML = `
                <div class="flex items-center gap-3 group/user relative cursor-pointer">
                    <div class="text-right flex flex-col items-end">
                        <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.15em] leading-none mb-0.5">Sistema Ativo</span>
                        <span class="text-[11px] text-white font-black uppercase tracking-widest">${user.name}</span>
                    </div>
                    <div class="relative">
                        <img src="${user.avatar}" alt="Avatar" referrerpolicy="no-referrer" class="w-10 h-10 rounded-xl border border-brand/40 shadow-[0_0_15px_rgba(144,72,253,0.2)] bg-brand/10 transition-transform group-hover/user:scale-105" />
                        <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    </div>
                    
                    <!-- Profile Dropdown -->
                    <div class="absolute top-[calc(100%+10px)] right-0 w-48 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 translate-y-2 group-hover/user:translate-y-0 z-[200]">
                        <div class="bg-[#080808] border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                            <a href="dashboard.html" class="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors">
                                <i data-lucide="user" class="w-4 h-4 text-brand"></i> Minha Conta
                            </a>
                            <div class="h-px bg-white/5 my-1 mx-2"></div>
                            <button id="logoutBtn" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-red-400/60 hover:text-red-400 transition-colors">
                                <i data-lucide="log-out" class="w-4 h-4"></i> Deslogar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            if (window.lucide) lucide.createIcons();
            
            document.getElementById('logoutBtn')?.addEventListener('click', () => {
                localStorage.removeItem('collect_user');
                location.reload();
            });
        } catch(e) { console.error("Auth sync error", e); }
    };
    syncAuth();

    console.log('🚀 Collect Tweak site loaded successfully');
});


