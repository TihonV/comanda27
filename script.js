/* ============================================================
   PREMIUM GPU PLATFORM — SCRIPTS
   Version 2.0 (unified, no conflicts)
   ============================================================ */

'use strict';

/* ============================================================
   0. УТИЛИТЫ
   ============================================================ */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Добавляем @keyframes spin один раз (используется в кнопках) */
(function injectSpinKeyframes() {
    if (document.getElementById('__spin_keyframes__')) return;
    const style = document.createElement('style');
    style.id = '__spin_keyframes__';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
})();

/* ============================================================
   1. ПАРАЛЛАКС ФОНОВОЙ ГЕОМЕТРИИ
   Сдвигает всю сцену за курсором через CSS-переменные --mx/--my
   ============================================================ */
(function initDecorParallax() {
    const decor = document.getElementById('backgroundDecor');
    if (!decor) return;

    const root = document.documentElement;
    let rafId = null;

    const setOffset = (x, y) => {
        root.style.setProperty('--mx', `${x}px`);
        root.style.setProperty('--my', `${y}px`);
    };

    const onMove = (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            const cx = window.innerWidth  / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx; // -1 .. 1
            const dy = (e.clientY - cy) / cy;
            setOffset(dx * 25, dy * 25);
            rafId = null;
        });
    };

    const reset = () => setOffset(0, 0);

    if (!prefersReducedMotion) {
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', reset);

        // Лёгкий гироскоп-параллакс на мобильных
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                if (e.gamma == null || e.beta == null) return;
                const dx = Math.max(-1, Math.min(1, e.gamma / 45));
                const dy = Math.max(-1, Math.min(1, e.beta  / 45));
                setOffset(dx * 15, dy * 15);
            });
        }
    }
})();

/* ============================================================
   2. ПОЯВЛЕНИЕ КАРТОЧЕК ПРИ СКРОЛЛЕ
   Каскадная анимация через IntersectionObserver
   ============================================================ */
(function initScrollReveal() {
    if (prefersReducedMotion) return;

    const targets = $$('.group-card, .table-row, .student-chip');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition =
            `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s, ` +
            `transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s`;
        observer.observe(el);
    });
})();

/* ============================================================
   3. КНОПКА «ИСПОЛЬЗОВАТЬ GPU»
   Имитация подключения к сессии
   ============================================================ */
(function initUseGpuButton() {
    const btn = document.getElementById('useGpuBtn');
    if (!btn) return;

    const ICON_SPIN = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round"
             style="animation: spin 1s linear infinite;">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>`;

    const ICON_OK = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>`;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.disabled) return;

        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `${ICON_SPIN} Подключение...`;

        setTimeout(() => {
            btn.innerHTML = `${ICON_OK} Сессия активна`;

            setTimeout(() => {
                btn.innerHTML = original;
                btn.disabled = false;
            }, 2000);
        }, 1500);
    });
})();

/* ============================================================
   4. ОБРАБОТКА ФОРМ
   Универсальная имитация отправки
   ============================================================ */
(function initForms() {
    const forms = $$('form');
    if (!forms.length) return;

    const ICON_SPIN = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round"
             style="animation: spin 1s linear infinite;">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>`;

    const ICON_OK = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>`;

    forms.forEach(form => {
        // Если у формы нет атрибута data-fake, пропускаем (вдруг когда-то будет реальная)
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            if (!btn || btn.disabled) return;

            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `${ICON_SPIN} Сохранение...`;

            setTimeout(() => {
                btn.innerHTML = `${ICON_OK} Готово`;

                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    // form.reset(); // раскомментировать, если нужно очищать поля
                }, 1500);
            }, 1200);
        });
    });
})();

/* ============================================================
   5. АДМИН-ПАНЕЛЬ: АНИМАЦИЯ ЦИФР В СТАТИСТИКЕ
   Считает от 0 до data-count при появлении
   ============================================================ */
(function initStatCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const animateValue = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const duration = 1500;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            el.textContent = Math.floor(target * eased).toLocaleString('ru-RU');

            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString('ru-RU');
        };

        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateValue(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   6. АДМИН-ПАНЕЛЬ: АНИМАЦИЯ ПРОГРЕСС-БАРОВ GPU
   ============================================================ */
(function initProgressBars() {
    const fills = $$('.progress-fill');
    if (!fills.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const fill = entry.target;
            const width = parseFloat(fill.getAttribute('data-width')) || 0;
            // Небольшая задержка для плавности
            setTimeout(() => { fill.style.width = width + '%'; }, 200);
            observer.unobserve(fill);
        });
    }, { threshold: 0.3 });

    fills.forEach(fill => observer.observe(fill));
})();

/* ============================================================
   7. АДМИН-ПАНЕЛЬ: КНОПКА ВЫХОДА
   ============================================================ */
(function initLogout() {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (confirm('Выйти из админ-панели?')) {
            window.location.href = 'index.html';
        }
    });
})();

/* ============================================================
   8. ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРНЫХ ССЫЛОК
   (на будущее, если появятся якоря)
   ============================================================ */
(function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();

/* ============================================================
   9. МИКРО-ВЗАИМОДЕЙСТВИЕ: КНОПКИ С ПУЛЬСАЦИЕЙ ПРИ КЛИКЕ
   ============================================================ */
(function initClickRipple() {
    if (prefersReducedMotion) return;

    const buttons = $$('.btn-primary');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top  - size / 2;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%);
                transform: scale(0);
                animation: ripple 0.7s ease-out;
                pointer-events: none;
            `;

            if (!document.getElementById('__ripple_keyframes__')) {
                const style = document.createElement('style');
                style.id = '__ripple_keyframes__';
                style.textContent = '@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }';
                document.head.appendChild(style);
            }

            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });
})();

/* ============================================================
   КОНЕЦ
   ============================================================ */
console.log('%c✨ GPU Platform v2.0 ready', 'color:#2ecc71;font-weight:700;font-size:13px;');
