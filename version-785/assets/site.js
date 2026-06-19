(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.dataset.target || 0));
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var localFilter = document.querySelector('.local-filter');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-chip'));
    var filterCards = Array.prototype.slice.call(document.querySelectorAll('.filterable-grid .movie-card'));
    var activeYear = 'all';

    function applyLocalFilter() {
        var keyword = localFilter ? localFilter.value.trim().toLowerCase() : '';

        filterCards.forEach(function (card) {
            var haystack = [
                card.dataset.title || '',
                card.dataset.year || '',
                card.dataset.region || '',
                card.dataset.genre || ''
            ].join(' ').toLowerCase();
            var yearMatch = activeYear === 'all' || card.dataset.year === activeYear;
            var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
            card.style.display = yearMatch && keywordMatch ? '' : 'none';
        });
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (item) {
                item.classList.remove('active');
            });
            button.classList.add('active');
            activeYear = button.dataset.filter || 'all';
            applyLocalFilter();
        });
    });

    if (localFilter) {
        localFilter.addEventListener('input', applyLocalFilter);
    }

    var searchData = window.MOVIE_SEARCH_INDEX || [];
    var searchResults = document.getElementById('searchResults');
    var searchInput = document.getElementById('searchInput');
    var searchTitle = document.getElementById('searchTitle');
    var searchCount = document.getElementById('searchCount');

    function cardTemplate(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '' +
            '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '" data-year="' + escapeHtml(movie.year) + '" data-region="' + escapeHtml(movie.region) + '" data-genre="' + escapeHtml(movie.genreRaw) + '">' +
            '    <a class="poster" href="detail/' + movie.id + '.html" aria-label="观看' + escapeHtml(movie.title) + '">' +
            '        <img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '封面" loading="lazy" onerror="this.classList.add(\'image-missing\')">' +
            '        <span class="poster-fallback">' + escapeHtml(movie.title.slice(0, 8)) + '</span>' +
            '        <em>' + escapeHtml(movie.type) + '</em>' +
            '    </a>' +
            '    <div class="card-body">' +
            '        <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>' +
            '        <h3><a href="detail/' + movie.id + '.html">' + escapeHtml(movie.title) + '</a></h3>' +
            '        <p>' + escapeHtml(movie.oneLine) + '</p>' +
            '        <div class="tags">' + tags + '</div>' +
            '    </div>' +
            '</article>';
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    function renderSearch() {
        if (!searchResults || !searchData.length) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var q = (params.get('q') || '').trim();

        if (searchInput) {
            searchInput.value = q;
        }

        if (!q) {
            return;
        }

        var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
        var matched = searchData.filter(function (movie) {
            var text = [movie.title, movie.region, movie.type, movie.year, movie.genreRaw, movie.oneLine, (movie.tags || []).join(' ')].join(' ').toLowerCase();
            return terms.every(function (term) {
                return text.indexOf(term) !== -1;
            });
        });

        searchTitle.textContent = '搜索结果';
        searchCount.textContent = '“' + q + '” 找到 ' + matched.length + ' 个相关作品';
        searchResults.innerHTML = matched.slice(0, 240).map(cardTemplate).join('') || '<p class="empty-message">没有找到相关影片，请尝试其他关键词。</p>';
    }

    renderSearch();
}());
