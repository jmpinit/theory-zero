// piano
var d3 = require("./d3.min.js");
var $ = require("./jquery.min.js");
var Piano = require("./piano.js").Piano;
var PianoInfo = require("./piano.js").PianoInfo;
var midi = require("./midi.js");
var _ = require("./underscore-min.js");

var piano;

// load song data
$.getJSON("data/songs.json", function(data) {
    var demoSong = data[0];

    piano = new Piano(d3.select("body"),
        ["E", "F-", "G-", "A", "B", "C-", "D-"],
        {
            width: $(window).width(),
            height: 100
        }
    );
    piano.transpositition = 3;

    _.map(Object.keys(demoSong.colors), function (note) {
        var keysToColor = [];

        if (note.length == 2) {
            // sharp or flat
            keysToColor = _.filter(PianoInfo.keys, function (key) {
                return key.indexOf(note) !== -1;
            });
        } else {
            // normal
            keysToColor = _.filter(PianoInfo.keys, function (key) {
                if (key.indexOf("-") === -1 && key.indexOf("_") === -1) {
                    return key.indexOf(note) !== -1;
                } else {
                    return false;
                }
            });
        }

        _.map(keysToColor, function (key) {
            piano.svg
                .select("#" + key)
                .style("fill", demoSong.colors[note]);
        });
    });
});

// MIDI
(function () {
    require("./midilib.js");
    var midi = require("./midi.js");

    var m = new MidiPlayer("midi/dont-stop-believing.mid", "player", true, -1);
    setTimeout(function () {
        m.play();
    }, 1000);

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(midi.onMIDIInit, midi.onMIDIReject);
    } else {
        console.log("No browser MIDI support, please check out http://jazz-soft.net/ and get that browser fixed!")
    }
})();


window.superSpecialNoteCallback = function (eventType, channel, note) {
    switch (eventType) {
        case "on":
            if (channel == 0)
                piano.hint(note, "green");
            else {
                piano.hint(note, "yellow")
            }
            break;
        case "off":
            break;
    }
};

// Song data
$.getJSON( "song.json", function(data) {
    midi.queueSong(data);

    var start = new Date().getTime();
    var time = start;

    function playNotes() {
        requestAnimationFrame(playNotes);

        var now = new Date().getTime();

        /*midi.getNotes(time - start, now - start, function(note) {
            piano.press(note);
        });*/

        _.map(midi.activeNotes, function (note) {
            piano.press(note);
        })

        time = now;
    }

    requestAnimationFrame(playNotes);
});
