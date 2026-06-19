(function () {
  var mobileButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (mobileButton && mobileMenu) {
    mobileButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  var searchPanel = document.querySelector('[data-search-panel]');
  var searchResults = document.querySelector('[data-search-results]');
  var closeSearch = document.querySelector('[data-search-close]');

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function renderSearchResults(query) {
    if (!searchPanel || !searchResults) {
      return;
    }

    var keyword = normalize(query);
    var index = window.MOVIE_SEARCH_INDEX || [];

    if (!keyword) {
      searchResults.innerHTML = '<p class="search-empty">请输入片名、年份、地区、类型或关键词。</p>';
      searchPanel.classList.add('open');
      return;
    }

    var matches = index.filter(function (item) {
      var text = [
        item.title,
        item.category,
        item.genre,
        item.year,
        item.region,
        item.oneLine
      ].join(' ').toLowerCase();
      return text.indexOf(keyword) !== -1;
    }).slice(0, 24);

    if (!matches.length) {
      searchResults.innerHTML = '<p class="search-empty">没有找到相关影片。</p>';
      searchPanel.classList.add('open');
      return;
    }

    searchResults.innerHTML = matches.map(function (item) {
      return [
        '<a class="search-result-item" href="' + item.url + '">',
        '  <img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy" decoding="async">',
        '  <span>',
        '    <strong>' + item.title + '</strong>',
        '    <span>' + item.category + ' · ' + item.genre + ' · ' + item.year + ' · ' + item.region + '</span>',
        '  </span>',
        '</a>'
      ].join('');
    }).join('');
    searchPanel.classList.add('open');
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('[data-search-input]');
      renderSearchResults(input ? input.value : '');
    });
  });

  document.querySelectorAll('[data-search-input]').forEach(function (input) {
    input.addEventListener('input', function () {
      if (input.value.trim().length >= 2) {
        renderSearchResults(input.value);
      }
    });
  });

  if (closeSearch && searchPanel) {
    closeSearch.addEventListener('click', function () {
      searchPanel.classList.remove('open');
    });
  }

  document.addEventListener('click', function (event) {
    if (!searchPanel || !searchPanel.classList.contains('open')) {
      return;
    }

    var isInsideSearch = searchPanel.contains(event.target);
    var isSearchForm = event.target.closest('[data-search-form]');

    if (!isInsideSearch && !isSearchForm) {
      searchPanel.classList.remove('open');
    }
  });

  document.querySelectorAll('[data-card-scope]').forEach(function (scope) {
    var searchInput = scope.querySelector('[data-library-search]');
    var buttons = scope.querySelectorAll('[data-filter]');
    var cards = scope.querySelectorAll('[data-card]');
    var activeFilter = 'all';

    function applyFilters() {
      var keyword = normalize(searchInput ? searchInput.value : '');
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var category = card.getAttribute('data-category');
        var matchFilter = activeFilter === 'all' || category === activeFilter;
        var matchText = !keyword || text.indexOf(keyword) !== -1;
        card.classList.toggle('is-hidden', !(matchFilter && matchText));
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        activeFilter = button.getAttribute('data-filter') || 'all';
        applyFilters();
      });
    });
  });

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 6000);
    }
  });
})();
