(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-mobile-nav]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
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
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot') || 0));
                start();
            });
        });

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        start();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function initFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-filter-keyword]');
            var yearSelect = scope.querySelector('[data-filter-year]');
            var items = Array.prototype.slice.call(scope.querySelectorAll('[data-search-item]'));
            var empty = scope.querySelector('[data-empty-state]');
            if (!input || !items.length) {
                return;
            }
            if (scope.hasAttribute('data-query-from-url')) {
                var params = new URLSearchParams(window.location.search);
                var query = params.get('q');
                if (query) {
                    input.value = query;
                }
            }
            function update() {
                var keyword = normalize(input.value);
                var year = yearSelect ? yearSelect.value : '';
                var visible = 0;
                items.forEach(function (item) {
                    var text = normalize(item.getAttribute('data-search-text'));
                    var itemYear = item.getAttribute('data-year') || '';
                    var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchedYear = !year || itemYear === year;
                    var matched = matchedKeyword && matchedYear;
                    item.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }
            input.addEventListener('input', update);
            if (yearSelect) {
                yearSelect.addEventListener('change', update);
            }
            update();
        });
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        players.forEach(function (player) {
            var video = player.querySelector('video');
            var button = player.querySelector('[data-play]');
            var configNode = player.querySelector('.player-config');
            if (!video || !button || !configNode) {
                return;
            }
            var source = '';
            try {
                source = JSON.parse(configNode.textContent || '{}').src || '';
            } catch (error) {
                source = '';
            }
            var hls = null;
            var prepared = false;

            function prepare() {
                if (prepared || !source) {
                    return;
                }
                prepared = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    return;
                }
                video.src = source;
            }

            function play() {
                prepare();
                button.classList.add('is-hidden');
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {
                        button.classList.remove('is-hidden');
                    });
                }
            }

            button.addEventListener('click', play);
            video.addEventListener('click', function () {
                if (!prepared || video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                button.classList.add('is-hidden');
            });
            video.addEventListener('pause', function () {
                if (video.currentTime === 0 || video.ended) {
                    button.classList.remove('is-hidden');
                }
            });
            window.addEventListener('beforeunload', function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });
})();
