define(function () {
    function BufferLoader(audioCore, callback) {
        this.audioCore = audioCore;
        this.context = this.audioCore.ctx;
        this.analyser = this.audioCore.analyser;
        this.urlList = this.audioCore.mediaArray;
        this.playingList = this.audioCore.playingList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
    }

    BufferLoader.prototype.loadBuffer = function(url, index) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        var loader = this;

        request.onload = function() {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function(buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount == loader.urlList.length)
                        loader.onload(loader.audioCore, loader.bufferList, loader.context, loader.analyser, loader.playingList);
                },
                function(error) {
                    console.error('decodeAudioData error', error);
                }
            );
        };

        request.onerror = function() {
            alert('BufferLoader: XHR error');
        };

        request.send();
    };

    BufferLoader.prototype.load = function() {
        for (var i = 0; i < this.urlList.length; ++i)
            this.loadBuffer(this.urlList[i], i);
    };

    return BufferLoader;
});
