(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function runFilter(targetSelector) {
        var input = document.querySelector('[data-search-input][data-target="' + targetSelector + '"]');
        var select = document.querySelector('[data-filter-select][data-target="' + targetSelector + '"]');
        var root = document.querySelector(targetSelector);

        if (!root) {
            return;
        }

        var keyword = normalize(input ? input.value : '');
        var selected = normalize(select ? select.value : '');
        var cards = root.querySelectorAll('[data-card]');

        cards.forEach(function (card) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-category'),
                card.textContent
            ].join(' '));
            var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
            var selectedMatch = !selected || text.indexOf(selected) !== -1;
            card.classList.toggle('is-hidden', !(keywordMatch && selectedMatch));
        });
    }

    document.querySelectorAll('[data-search-input], [data-filter-select]').forEach(function (control) {
        var eventName = control.matches('select') ? 'change' : 'input';
        control.addEventListener(eventName, function () {
            runFilter(control.getAttribute('data-target'));
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        setInterval(function () {
            show(current + 1);
        }, 6500);
    }
})();
