function AudioCore(mediaLibrary, size, finishLoadingCallback) {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = size;
    this.playingList = [];
    this.paused = true;
    this.mediaArray = mediaLibrary;


    this.bufferLength = this.analyser.fftSize;
    this.dataArray = new Float32Array(this.bufferLength);
    this.bufferLoader = new BufferLoader(
        this.ctx,
        this.analyser,
        this.mediaArray,
        this.playingList,
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

function CanvasCore(element, audio) {
    this.audio = audio;
    this.canvas = element;
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
}

CanvasCore.prototype.drawCanvas = function () {
    requestAnimationFrame(this.loop.bind(this));
    this.audio.analyser.getFloatTimeDomainData(this.audio.dataArray);

    this.clearCanvas();
    this.printRain();
    this.printWave();
};

CanvasCore.prototype.loop = function () {
    this.drawCanvas();
};

CanvasCore.prototype.clearCanvas = function () {
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, this.width, this.height);
};

CanvasCore.prototype.printWave = function () {
    this.ctx.save();
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = 'rgb(255, 255, 255)';
    this.ctx.beginPath();

    var sliceWidth = this.width * 1.0 / this.audio.bufferLength;
    var x = 0,
        initialY = this.height / 3 * 2;

    for (var i = 0; i < this.audio.bufferLength; i++) {
        var y = initialY,
            v = this.audio.dataArray[i] * 200.0;

        if (!this.audio.paused) {
            y = y + v / 2;
        }

        if (i === 0) {
            this.ctx.moveTo(x, y);
        } else {
            this.ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    this.ctx.lineTo(this.width, initialY);
    this.ctx.stroke();
    this.ctx.restore();
};

CanvasCore.prototype.printRain = function () {
    this.ctx.save();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgb(255, 255, 255)';
    for (var c = 0; c < particles.length; c++) {
        var p = particles[c];
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        this.ctx.stroke();
    }
    this.ctx.restore();
    this.moveRain();
}

CanvasCore.prototype.moveRain = function () {
    for (var b = 0; b < particles.length; b++) {
        var p = particles[b];
        var d = this.audio.paused ? 0 : this.audio.dataArray[0];
        if (d < 0) {
            d *= -1;
        }
        p.x += p.xs;
        p.y += p.ys + d * 100;
        if (p.x > this.width || p.y > this.height) {
            p.x = Math.random() * this.width;
            p.y = 0;
        }
    }
};

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


var init = [];
var maxParts = 1000;
for (var a = 0; a < maxParts; a++) {
    init.push({
        x: Math.random() * canvasCore.width,
        y: Math.random() * canvasCore.height,
        l: Math.random(),
        xs: Math.random() / 2,
        ys: Math.random()
    })
}

var particles = [];
for (var b = 0; b < maxParts; b++) {
    particles[b] = init[b];
}


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