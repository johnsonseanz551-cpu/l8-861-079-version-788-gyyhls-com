(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobilePanel.hidden = expanded;
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var nextButton = hero.querySelector('.hero-next');
    var prevButton = hero.querySelector('.hero-prev');
    var current = 0;
    var timer = null;

    function showSlide(index) {
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

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  var filterBar = document.querySelector('[data-filter-bar]');

  if (filterBar) {
    var searchInput = filterBar.querySelector('[data-card-search]');
    var yearSelect = filterBar.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-grid] .movie-card'));

    function applyFilters() {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';

      cards.forEach(function (card) {
        var text = [
          card.dataset.title,
          card.dataset.category,
          card.dataset.year,
          card.dataset.region,
          card.dataset.genre
        ].join(' ').toLowerCase();
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !year || card.dataset.year === year;
        card.classList.toggle('is-hidden-card', !(matchKeyword && matchYear));
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', applyFilters);
    }
  }

  var resultContainer = document.querySelector('[data-search-results]');
  var summaryNode = document.querySelector('[data-search-summary]');

  if (resultContainer && window.SEARCH_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var bigInput = document.querySelector('.big-search input[name="q"]');

    if (bigInput) {
      bigInput.value = query;
    }

    function cardTemplate(item) {
      return [
        '<article class="movie-card">',
        '  <a href="./' + item.file + '" class="card-link">',
        '    <span class="poster-wrap"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy"></span>',
        '    <span class="card-body">',
        '      <span class="meta-row"><em>' + escapeHtml(item.category) + '</em><small>' + escapeHtml(item.year) + '年</small></span>',
        '      <strong>' + escapeHtml(item.title) + '</strong>',
        '      <span>' + escapeHtml(item.oneLine) + '</span>',
        '      <small>' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + '</small>',
        '    </span>',
        '  </a>',
        '</article>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    var normalized = query.toLowerCase();
    var results = window.SEARCH_INDEX.filter(function (item) {
      if (!normalized) {
        return true;
      }

      return item.text.toLowerCase().indexOf(normalized) !== -1;
    });

    if (summaryNode) {
      summaryNode.textContent = query ? '搜索“' + query + '”的相关结果' : '全部影视作品';
    }

    resultContainer.innerHTML = results.slice(0, 240).map(cardTemplate).join('');
  }
})();

function initMoviePlayer(streamUrl) {
  var player = document.querySelector('.movie-player');

  if (!player) {
    return;
  }

  var video = player.querySelector('video');
  var overlay = player.querySelector('.player-overlay');
  var hlsInstance = null;
  var attached = false;

  if (!video) {
    return;
  }

  function attachStream() {
    if (attached) {
      return;
    }

    attached = true;

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else {
      video.src = streamUrl;
    }
  }

  function beginPlay() {
    attachStream();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', beginPlay);
  }

  player.addEventListener('click', function (event) {
    if (event.target === video || event.target === player) {
      beginPlay();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('canplay', function () {
    if (overlay && overlay.classList.contains('is-hidden') && video.paused) {
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
