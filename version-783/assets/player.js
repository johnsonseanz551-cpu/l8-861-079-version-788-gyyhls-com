(function () {
    var video = document.querySelector('.player-video');
    var button = document.querySelector('[data-play-button]');
    var config = document.getElementById('stream-config');
    var stream = '';
    var started = false;

    try {
        stream = JSON.parse(config.textContent || '{}').stream || '';
    } catch (error) {
        stream = '';
    }

    function start() {
        if (!video || !stream) {
            return;
        }

        if (!started) {
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
            started = true;
        }

        if (button) {
            button.classList.add('is-hidden');
        }

        var playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') {
            playResult.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', start);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (!started) {
                start();
            }
        });
    }
})();
