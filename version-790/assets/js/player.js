import { H as Hls } from './hls.js';

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.js-player').forEach(function (player) {
    setupPlayer(player);
  });
});

function setupPlayer(player) {
  var video = player.querySelector('video[data-hls]');
  var button = player.querySelector('[data-play-toggle]');
  var message = player.querySelector('[data-player-message]');

  if (!video) {
    return;
  }

  var source = video.getAttribute('data-hls');

  function showMessage(text) {
    if (!message) {
      return;
    }
    message.textContent = text;
    message.classList.add('show');
  }

  if (source) {
    if (Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        if (message) {
          message.classList.remove('show');
        }
      });
      hls.on(Hls.Events.ERROR, function (_, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          showMessage('网络连接异常，正在重新加载视频源。');
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          showMessage('媒体解码异常，正在尝试恢复播放。');
          hls.recoverMediaError();
        } else {
          showMessage('当前浏览器暂时无法播放该视频。');
          hls.destroy();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      showMessage('当前浏览器不支持 HLS 视频播放。');
    }
  }

  function togglePlayback() {
    if (video.paused) {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          showMessage('请再次点击播放按钮开始播放。');
        });
      }
    } else {
      video.pause();
    }
  }

  if (button) {
    button.addEventListener('click', togglePlayback);
  }

  video.addEventListener('click', togglePlayback);
  video.addEventListener('play', function () {
    player.classList.add('playing');
  });
  video.addEventListener('pause', function () {
    player.classList.remove('playing');
  });
}
