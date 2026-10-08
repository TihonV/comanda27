/* ============================================
   PREMIUM GPU PLATFORM — SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Плавное появление карточек при скролле --- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.group-card, .table-row, .student-chip').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s`;
        observer.observe(el);
    });

    /* --- Кнопка использования GPU --- */
    const useGpuBtn = document.getElementById('useGpuBtn');
    if (useGpuBtn) {
        useGpuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = useGpuBtn.innerHTML;
            useGpuBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Подключение...
            `;

            const style = document.createElement('style');
            style.innerHTML = '@keyframes spin { to { transform: rotate(360deg); } }';
            document.head.appendChild(style);

            setTimeout(() => {
                useGpuBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Сессия активна
                `;
                setTimeout(() => { useGpuBtn.innerHTML = originalText; }, 2000);
            }, 1500);
        });
    }

    /* --- Обработка форм --- */
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            if (!btn) return;

            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Сохранение...
            `;
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Готово
                `;
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }, 1500);
            }, 1200);
        });
    });

    /* --- Параллакс для светящихся сфер --- */
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        document.body.style.backgroundPosition = `${x}px ${y}px`;
    });

});
/* ============================================
   ADMIN PANEL ANIMATIONS
   ============================================ */

// Анимация цифр в статистике
document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        el.textContent = Math.floor(target * eased).toLocaleString('ru-RU');

        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = target.toLocaleString('ru-RU');
    };

    requestAnimationFrame(animate);
});

// Анимация прогресс-баров GPU
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const width = fill.getAttribute('data-width');
            setTimeout(() => { fill.style.width = width + '%'; }, 200);
            progressObserver.unobserve(fill);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.progress-fill').forEach(fill => {
    progressObserver.observe(fill);
});

// Кнопка выхода
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Выйти из админ-панели?')) {
            window.location.href = 'index.html';
        }
    });
}
