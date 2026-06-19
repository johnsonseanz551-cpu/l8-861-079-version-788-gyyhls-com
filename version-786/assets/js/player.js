var blocks = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));
var Hls = window.Hls;

blocks.forEach(function (block) {
  var video = block.querySelector('video');
  var stream = video ? video.querySelector('source') : null;
  var cover = block.querySelector('.player-cover');
  var streamUrl = stream ? stream.getAttribute('src') : '';
  var hls = null;

  var bind = function () {
    if (!video || !streamUrl) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', streamUrl);
      }
      return;
    }
    if (Hls && Hls.isSupported()) {
      if (!hls) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      }
      return;
    }
    if (!video.getAttribute('src')) {
      video.setAttribute('src', streamUrl);
    }
  };

  var play = function () {
    bind();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    var attempt = video.play();
    if (attempt && attempt.catch) {
      attempt.catch(function () {});
    }
  };

  bind();

  if (cover) {
    cover.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
  }
});
