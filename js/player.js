window.onload = init;
var context;
var bufferLoader;

function init() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    bufferLoader = new BufferLoader(
        context,
        [
            'media/do.wav',
            'media/re.wav',
            'media/mi.wav',
            'media/fa.wav',
            'media/sol.wav',
            'media/la.wav',
            'media/si.wav',
            'media/do.wav',
        ],
        finishedLoading
    );

    bufferLoader.load();
}

function finishedLoading(bufferList) {
    // Create two sources and play them both together.
    for(var i = 0 ; i <8 ; i++){
        console.log(i);
        console.log(bufferList[i]);
        var source1 = context.createBufferSource();
        console.log(source1);
        source1.buffer = bufferList[i];
        source1.connect(context);
        //debugger;
        //source1.start(0);
        source1.start();
    }
}