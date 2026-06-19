(function (global) {
    function safePlay(video) {
        var result = video.play();
        if (result && typeof result.catch === "function") {
            result.catch(function () {});
        }
    }

    global.initMoviePlayer = function (videoId, coverId, streamUrl) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        var hls = null;
        var attached = false;

        if (!video || !streamUrl) {
            return;
        }

        function attachStream() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (global.Hls && global.Hls.isSupported()) {
                hls = new global.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function start() {
            attachStream();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.controls = true;
            safePlay(video);
        }

        if (cover) {
            cover.addEventListener("click", start);
        }

        video.addEventListener("click", function () {
            if (!attached) {
                start();
            }
        });

        video.addEventListener("play", function () {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
}(window));
