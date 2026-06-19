(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero-carousel]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var current = 0;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
        });
      });

      if (slides.length > 1) {
        setInterval(function () {
          show(current + 1);
        }, 5200);
      }
    }

    var scope = document.querySelector("[data-filter-scope]");

    if (scope) {
      var input = scope.querySelector(".local-filter");
      var year = scope.querySelector(".year-filter");
      var type = scope.querySelector(".type-filter");
      var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-results .movie-card"));

      function filterCards() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var selectedYear = year ? year.value : "";
        var selectedType = type ? type.value : "";

        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-card-title") || "",
            card.getAttribute("data-card-tags") || ""
          ].join(" ").toLowerCase();
          var cardYear = card.getAttribute("data-card-year") || "";
          var cardType = card.getAttribute("data-card-type") || "";
          var matched = true;

          if (query && text.indexOf(query) === -1) {
            matched = false;
          }
          if (selectedYear && cardYear !== selectedYear) {
            matched = false;
          }
          if (selectedType && cardType !== selectedType) {
            matched = false;
          }

          card.style.display = matched ? "" : "none";
        });
      }

      [input, year, type].forEach(function (element) {
        if (element) {
          element.addEventListener("input", filterCards);
          element.addEventListener("change", filterCards);
        }
      });
    }
  });
})();
