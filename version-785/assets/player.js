import { H as Hls } from './hls-dru42stk.js';

function initVideoPlayer(root) {
    var video = root.querySelector('video');
    var button = root.querySelector('.play-overlay');
    var status = root.querySelector('.player-status');
    var source = root.dataset.videoSrc;
    var loaded = false;

    function setStatus(message) {
        if (status) {
            status.textContent = message;
        }
    }

    function loadAndPlay() {
        if (!video || !source) {
            setStatus('播放源缺失。');
            return;
        }

        if (!loaded) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                loaded = true;
                root.classList.add('loaded');
                setStatus('正在使用浏览器原生 HLS 播放。');
                video.play().catch(function () {
                    setStatus('播放已加载，请再次点击播放按钮。');
                });
            } else if (Hls && Hls.isSupported()) {
                var hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    loaded = true;
                    root.classList.add('loaded');
                    setStatus('HLS 播放源已加载。');
                    video.play().catch(function () {
                        setStatus('播放已加载，请再次点击播放按钮。');
                    });
                });
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus('播放加载失败，请刷新页面或稍后重试。');
                    }
                });
            } else {
                video.src = source;
                loaded = true;
                root.classList.add('loaded');
                setStatus('当前浏览器不支持 HLS.js，已尝试直接加载播放源。');
                video.play().catch(function () {
                    setStatus('播放已加载，请再次点击播放按钮。');
                });
            }
        } else {
            video.play();
        }
    }

    if (button) {
        button.addEventListener('click', loadAndPlay);
    }

    if (video) {
        video.addEventListener('play', function () {
            root.classList.add('loaded');
        });
    }
}

Array.prototype.slice.call(document.querySelectorAll('.video-player')).forEach(initVideoPlayer);
