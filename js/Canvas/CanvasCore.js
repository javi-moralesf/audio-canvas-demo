define([], function () {
    function CanvasCore(element, audio) {
        this.audio = audio;
        this.canvas = element;
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];

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
        for (var c = 0; c < this.particles.length; c++) {
            var p = this.particles[c];
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            this.ctx.stroke();
        }
        this.ctx.restore();
        this.moveRain();
    }

    CanvasCore.prototype.moveRain = function () {
        for (var b = 0; b < this.particles.length; b++) {
            var p = this.particles[b];
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

    CanvasCore.prototype.setRainParticles = function (limit) {
        var init = [];
        for (var a = 0; a < limit; a++) {
            init.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                l: Math.random(),
                xs: Math.random() / 2,
                ys: Math.random()
            })
        }

        this.particles = [];
        for (var b = 0; b < limit; b++) {
            this.particles[b] = init[b];
        }
    };

    return CanvasCore;
});
