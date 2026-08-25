// Shared subpage enhancements: staggered scroll-reveal for Books / Tools / IF-ELSE grids.
(function () {
    'use strict';

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('[data-current-year]').forEach(function (element) {
        element.textContent = String(new Date().getFullYear());
    });

    document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
        link.rel = 'noopener noreferrer';
    });

    // Auto-tag grid cards so they fade in with a subtle stagger.
    var cards = document.querySelectorAll(
        '.tool-grid > [class*="col-"], .book-grid > [class*="col-"]'
    );
    cards.forEach(function (card, i) {
        card.classList.add('reveal');
        card.style.transitionDelay = Math.min(i * 55, 330) + 'ms';
    });

    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('in-view'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    items.forEach(function (el) { observer.observe(el); });
})();
