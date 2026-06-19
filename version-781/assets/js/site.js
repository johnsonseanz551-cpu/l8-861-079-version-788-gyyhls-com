(function () {
    var mobileButton = document.querySelector('[data-mobile-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (mobileButton && mobileMenu) {
        mobileButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var sliders = document.querySelectorAll('[data-hero-slider]');

    sliders.forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var next = slider.querySelector('[data-hero-next]');
        var prev = slider.querySelector('[data-hero-prev]');
        var active = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, current) {
                slide.classList.toggle('is-active', current === active);
            });

            dots.forEach(function (dot, current) {
                dot.classList.toggle('is-active', current === active);
            });
        }

        function move(step) {
            show(active + step);
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                move(1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                restart();
            });
        });

        if (next) {
            next.addEventListener('click', function () {
                move(1);
                restart();
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                move(-1);
                restart();
            });
        }

        show(0);
        restart();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-filter-text]');
        var year = scope.querySelector('[data-filter-year]');
        var category = scope.querySelector('[data-filter-category]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

        function apply() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var selectedYear = year ? year.value : '';
            var selectedCategory = category ? category.value : '';

            cards.forEach(function (card) {
                var searchText = (card.getAttribute('data-card-search') || card.textContent || '').toLowerCase();
                var byText = query === '' || searchText.indexOf(query) !== -1;
                var byYear = selectedYear === '' || card.getAttribute('data-year') === selectedYear;
                var byCategory = selectedCategory === '' || card.getAttribute('data-category') === selectedCategory;
                card.style.display = byText && byYear && byCategory ? '' : 'none';
            });
        }

        [input, year, category].forEach(function (element) {
            if (element) {
                element.addEventListener('input', apply);
                element.addEventListener('change', apply);
            }
        });

        apply();
    });

    var heroSearch = document.querySelector('[data-hero-search]');
    var heroButton = document.querySelector('[data-hero-search-button]');
    var mainSearch = document.querySelector('[data-main-search]');
    var mainCatalog = document.querySelector('[data-main-catalog]');

    function runHeroSearch() {
        if (!heroSearch || !mainSearch || !mainCatalog) {
            return;
        }

        mainSearch.value = heroSearch.value;
        mainSearch.dispatchEvent(new Event('input', { bubbles: true }));
        mainCatalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (heroSearch) {
        heroSearch.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                runHeroSearch();
            }
        });
    }

    if (heroButton) {
        heroButton.addEventListener('click', runHeroSearch);
    }
})();
