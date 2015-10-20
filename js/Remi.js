requirejs(['Audio/AudioCore', 'Canvas/CanvasCore'], function(AudioCore, CanvasCore) {
    var audio = new AudioCore([
            'media/sound_1.mp3',
            'media/sound_2.mp3',
            'media/sound_3.mp3',
            'media/sound_4.mp3',
            'media/sound_5.mp3',
            'media/sound_6.mp3',
            'media/sound_7.mp3',
            'media/sound_8.mp3',
            'media/sound_9.mp3',
            'media/sound_10.wav',
            'media/sound_11.wav',
            'media/sound_12.wav',
            'media/sound_13.wav',
            'media/sound_14.mp3',
            'media/sound_15.wav',
            'media/sound_16.wav',
            'media/sound_17.wav',
            'media/sound_18.wav',
            'media/sound_19.wav',
            'media/sound_20.mp3',
            'media/sound_21.mp3',
            'media/sound_22.mp3',
            'media/sound_23.mp3',
            'media/sound_24.mp3',
            'media/sound_25.mp3',
            'media/sound_26.mp3',
            'media/sound_27.mp3'
        ],
        2048,
        function finishedLoading(bufferList, context, analyser, playingList) {
            for (var i in bufferList) {
                var buffer = bufferList[i],
                    source = context.createBufferSource();

                source.buffer = buffer;
                source.loop = true;
                source.start();
                console.log('push');
                playingList.push(source);
            }
        }
    );

    audio.load();

    var canvasCore = new CanvasCore(document.getElementsByTagName('canvas')[0], audio);
    canvasCore.setRainParticles(1000);
    canvasCore.clearCanvas();
    canvasCore.loop();

//events
    window.onkeypress = function (e) {
        if (audio.playingList.length > 0 && e.keyCode == 32) {
            for (var i in audio.playingList) {
                if (audio.playingList[i].playing) {
                    audio.disconnectSource(audio.playingList[i]);
                }
            }
            return;
        }
        if (audio.playingList.length === 0 || e.keyCode < 97 || e.keyCode > 122) {
            return false;
        }
        var index = e.keyCode - 97;
        audio.handleSourceConnection(audio.playingList[index]);

    };

    window.onresize = function () {
        canvasCore.width = window.innerWidth;
        canvasCore.height = window.innerHeight;
        canvasCore.canvas.width = canvasCore.width;
        canvasCore.canvas.height = canvasCore.height;
    };
});

