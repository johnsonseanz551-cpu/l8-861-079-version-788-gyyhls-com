(function () {
    function startPlayer(box) {
        if (!box || box.getAttribute('data-started') === '1') {
            return;
        }

        var video = box.querySelector('video');
        var overlay = box.querySelector('.player-overlay');

        if (!video) {
            return;
        }

        var streamUrl = video.getAttribute('data-stream');

        if (!streamUrl) {
            return;
        }

        box.setAttribute('data-started', '1');

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        video.setAttribute('controls', 'controls');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            video.play().catch(function () {});
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
            video.hlsPlayer = hls;
            return;
        }

        video.src = streamUrl;
        video.play().catch(function () {});
    }

    document.querySelectorAll('[data-player]').forEach(function (box) {
        var overlay = box.querySelector('.player-overlay');
        var video = box.querySelector('video');

        if (overlay) {
            overlay.addEventListener('click', function () {
                startPlayer(box);
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                startPlayer(box);
            });
        }
    });
})();
