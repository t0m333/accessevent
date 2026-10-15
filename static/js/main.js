/**
 * AccessEvent — вспомогательный JavaScript.
 * Все уведомления ВИЗУАЛЬНЫЕ (никаких звуковых сигналов) —
 * это требование доступности проекта.
 */

/**
 * Показать визуальное уведомление в правом верхнем углу.
 * @param {string} message - текст уведомления
 * @param {string} type - 'success' | 'error' | 'info'
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    if (!container) {
        return;
    }

    const notice = document.createElement('div');
    notice.className = 'notification notification-' + type;
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.textContent = message;
    container.appendChild(notice);

    // Уведомление исчезает через 4 секунды
    setTimeout(function() {
        notice.remove();
    }, 4000);
}

/**
 * Валидация форм при отправке: подсвечивает пустые поля.
 * Работает для всех форм с классом 'validate-me'.
 */
function setupFormValidation() {
    const forms = document.querySelectorAll('.validate-me');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let valid = true;

            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#c5221f';
                    field.setAttribute('aria-invalid', 'true');
                } else {
                    field.style.borderColor = '#dadce0';
                    field.removeAttribute('aria-invalid');
                }
            });

            if (!valid) {
                e.preventDefault();
                showNotification('Пожалуйста, заполните обязательные поля', 'error');
            }
        });
    });
}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    setupFormValidation();
});

// Экспорт для Node-стиля тестов (если понадобится)
if (typeof module !== 'undefined') {
    module.exports = { showNotification, setupFormValidation };
}


/* ============================================================
   Подводная тема: пузырьковый бурст при скролле вверх/вниз
   ============================================================ */

/**
 * Создаёт кучу пузырьков на весь экран.
 * @param {number} count - сколько пузырьков создать
 */
function createBubbleBurst(count) {
    const container = document.getElementById('bubbleBurst');
    if (!container) return;

    // Очищаем предыдущие
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const size = 40 + Math.random() * 100;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = (Math.random() * 100) + '%';
        bubble.style.bottom = '-200px';
        bubble.style.animationDuration = (2 + Math.random() * 2) + 's';
        bubble.style.animationDelay = (Math.random() * 0.8) + 's';

        container.appendChild(bubble);
    }

    container.classList.add('active');

    // Убираем бурст через 3.5 секунды
    setTimeout(function() {
        container.classList.remove('active');
    }, 3500);
}

/**
 * Следит за скроллом: при достижении верха или низа — запускает бурст пузырьков.
 */
(function setupScrollBubbles() {
    let lastBurst = 0;
    const COOLDOWN = 4000; // не чаще раза в 4 секунды

    window.addEventListener('scroll', function() {
        const now = Date.now();
        if (now - lastBurst < COOLDOWN) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // В самом верху (первые 30px) или в самом низу (последние 30px)
        const atTop = scrollTop < 30;
        const atBottom = scrollTop >= docHeight - 30;

        if (atTop || atBottom) {
            createBubbleBurst(60);
            lastBurst = now;
        }
    }, { passive: true });
})();