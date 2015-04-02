navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

// Utils

Float32Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Float32Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

// Processors

function rms(data){

  var rms = 0;
  for (var i = 0; i < data.length; i++) {
    rms += Math.pow(data[i], 2);
  }
  rms = rms / data.length;
  rms = Math.sqrt(rms);
  return rms;

}

// EventStreamer

if(navigator.getUserMedia){

  navigator.getUserMedia(
    {audio: true},
    function(localMediaStream) {
        var audioContext = new AudioContext();
        var stream = audioContext.createMediaStreamSource(localMediaStream);
        var bufferSize = 2048;
        var streamer = audioContext.createScriptProcessor(bufferSize, 2, 2);
        var inputStreamer = Bacon.fromEvent(streamer, "audioprocess")
        stream.connect(streamer);
        // Processing
        inputStreamer
            .map(e => e.inputBuffer.getChannelData(0))
            .map(rms)
            .log()
    },
    function(err){
        console.log(err);
    }
  )

}



