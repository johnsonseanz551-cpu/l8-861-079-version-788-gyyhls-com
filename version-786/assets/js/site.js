(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var previous = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    var show = function (index) {
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
    };

    var start = function () {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    };

    var stop = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var toolbars = Array.prototype.slice.call(document.querySelectorAll('[data-filter-toolbar]'));
  toolbars.forEach(function (toolbar) {
    var section = toolbar.closest('section') || document;
    var input = toolbar.querySelector('[data-filter-input]');
    var select = toolbar.querySelector('[data-category-filter]');
    var list = section.querySelector('[data-filter-list]');
    var empty = section.querySelector('[data-empty-state]');
    if (!list) {
      return;
    }
    var items = Array.prototype.slice.call(list.querySelectorAll('.filter-item'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');
    if (input && initialQuery) {
      input.value = initialQuery;
    }
    var apply = function () {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var category = select ? select.value : '';
      var visible = 0;
      items.forEach(function (item) {
        var text = [
          item.getAttribute('data-title') || '',
          item.getAttribute('data-region') || '',
          item.getAttribute('data-year') || '',
          item.getAttribute('data-category') || '',
          item.getAttribute('data-genre') || '',
          item.getAttribute('data-tags') || '',
          item.textContent || ''
        ].join(' ').toLowerCase();
        var itemCategory = item.getAttribute('data-category') || '';
        var matched = (!keyword || text.indexOf(keyword) !== -1) && (!category || itemCategory === category);
        item.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };
    if (input) {
      input.addEventListener('input', apply);
    }
    if (select) {
      select.addEventListener('change', apply);
    }
    apply();
  });
})();
