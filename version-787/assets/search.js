(function () {
  function createCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).join(" ");
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="' + movie.href + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" decoding="async">',
      '    <span class="poster-shade"></span>',
      '    <span class="poster-play">▶</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <a class="movie-title" href="' + movie.href + '">' + escapeHtml(movie.title) + '</a>',
      '    <div class="movie-meta">',
      '      <span>' + escapeHtml(movie.year || '') + '</span>',
      '      <span>' + escapeHtml(movie.region || '') + '</span>',
      '      <span>' + escapeHtml(movie.type || '') + '</span>',
      '    </div>',
      '    <p>' + escapeHtml(trimText(movie.oneLine || '', 68)) + '</p>',
      '    <div class="tag-row">',
      '      <span>' + escapeHtml(movie.category || '') + '</span>',
      '      <span>' + escapeHtml(trimText(movie.genre || tags, 18)) + '</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function trimText(value, max) {
    value = String(value || "");
    return value.length > max ? value.slice(0, max) + "…" : value;
  }

  function params() {
    return new URLSearchParams(window.location.search);
  }

  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var title = document.getElementById("search-title");
  var q = params().get("q") || "";

  if (input) {
    input.value = q;
  }

  if (!results || !window.SEARCH_MOVIES) {
    return;
  }

  if (!q.trim()) {
    return;
  }

  var query = q.trim().toLowerCase();
  var matched = window.SEARCH_MOVIES.filter(function (movie) {
    var text = [
      movie.title,
      movie.year,
      movie.region,
      movie.type,
      movie.genre,
      movie.category,
      movie.oneLine,
      (movie.tags || []).join(" ")
    ].join(" ").toLowerCase();
    return text.indexOf(query) !== -1;
  }).slice(0, 120);

  if (title) {
    title.textContent = matched.length ? "与“" + q + "”相关" : "没有找到匹配影片";
  }

  results.innerHTML = matched.map(createCard).join("");
})();
