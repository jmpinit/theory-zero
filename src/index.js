// piano
var d3 = require("./d3.min.js");
var $ = require("./jquery.min.js");
var Piano = require("./piano.js").Piano;
var midi = require("./midi.js");

var piano = new Piano(d3.select("body"),
    ["D#4", "C#5", "B5", "A5", "G#5", "F#5", "E5", "D#5", "C#6", "B6"],
    {
        width: $(window).width(),
        height: 100
    }
);

// MIDI
(function () {
    require("./midilib.js");
    var midi = require("./midi.js");

    var m = new MidiPlayer("song.mid", "player");

    $(function() {
        $("#player").click(function(){
            m.play();
        });
    });

    if (navigator.requestMIDIAccess){
        navigator.requestMIDIAccess().then(midi.onMIDIInit, midi.onMIDIReject);
    } else {
        console.log("No browser MIDI support, please check out http://jazz-soft.net/ and get that browser fixed!")
    }
})();

// Song data
$.getJSON( "song.json", function(data) {
    midi.queueSong(data);
    var start = new Date().getTime();
    var time = start;
    function playNotes() {
        requestAnimationFrame(playNotes);

        var now = new Date().getTime();

        midi.getNotes(time - start, now - start, function(note) { console.log(note) });

        time = now;
    }

    requestAnimationFrame(playNotes);
});
