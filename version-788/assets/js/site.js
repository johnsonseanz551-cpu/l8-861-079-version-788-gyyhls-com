(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function initMenu() {
        var button = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            var isOpen = panel.hasAttribute("hidden") === false;
            if (isOpen) {
                panel.setAttribute("hidden", "");
                button.setAttribute("aria-expanded", "false");
            } else {
                panel.removeAttribute("hidden");
                button.setAttribute("aria-expanded", "true");
            }
        });
    }

    function initSearchForms() {
        document.querySelectorAll(".search-form").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input) {
                    return;
                }
                var value = input.value.trim();
                if (!value) {
                    event.preventDefault();
                    window.location.href = "./search.html";
                }
            });
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initFilters() {
        var list = document.querySelector("[data-movie-list]");
        var panel = document.querySelector("[data-filter-panel]");
        if (!list || !panel) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]"));
        var keyword = panel.querySelector("[data-filter='q']");
        var category = panel.querySelector("[data-filter='category']");
        var year = panel.querySelector("[data-filter='year']");
        var type = panel.querySelector("[data-filter='type']");
        var params = new URLSearchParams(window.location.search);
        var queryValue = params.get("q") || "";

        if (keyword && queryValue) {
            keyword.value = queryValue;
        }

        function apply() {
            var q = normalize(keyword && keyword.value);
            var c = normalize(category && category.value);
            var y = normalize(year && year.value);
            var t = normalize(type && type.value);
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var cardCategory = normalize(card.getAttribute("data-category"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var cardType = normalize(card.getAttribute("data-type"));
                var matched = true;
                if (q && text.indexOf(q) === -1) {
                    matched = false;
                }
                if (c && cardCategory !== c) {
                    matched = false;
                }
                if (y && cardYear.indexOf(y) === -1) {
                    matched = false;
                }
                if (t && cardType.indexOf(t) === -1 && text.indexOf(t) === -1) {
                    matched = false;
                }
                card.hidden = !matched;
            });
        }

        [keyword, category, year, type].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener("input", apply);
            control.addEventListener("change", apply);
        });

        apply();
    }

    ready(function () {
        initMenu();
        initSearchForms();
        initHero();
        initFilters();
    });
}());
