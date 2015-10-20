define(['Lib/BufferLoader'], function (BufferLoader) {
    function AudioCore(mediaLibrary, size, finishLoadingCallback) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = size;
        this.playingList = [];
        this.paused = true;
        this.mediaLoaded = false;
        this.mediaArray = mediaLibrary;


        this.bufferLength = this.analyser.fftSize;
        this.dataArray = new Float32Array(this.bufferLength);
        this.bufferLoader = new BufferLoader(
            this,
            finishLoadingCallback
        );
    }

    AudioCore.prototype.load = function () {
        this.bufferLoader.load();
    };

    AudioCore.prototype.handleSourceConnection = function (source) {
        if (source.playing === true) {
            this.disconnectSource(source);
        } else {
            this.connectSource(source);
        }
    };

    AudioCore.prototype.disconnectSource = function (source) {
        source.disconnect(this.ctx.destination);
        source.disconnect(this.analyser);
        source.playing = false;

        var allPaused = true;
        for (var i in this.playingList) {
            if (this.playingList[i].playing === true) {
                allPaused = false;
                break;
            }
        }
        this.paused = allPaused;
    };

    AudioCore.prototype.connectSource = function (source) {
        source.connect(this.ctx.destination);
        source.connect(this.analyser);
        source.playing = true;
        this.paused = false;
    };

    return AudioCore;
});
