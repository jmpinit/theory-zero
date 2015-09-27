/*
var midi = require("./midi.js");


console.log("MIDI Test Initiated...");
if (navigator.requestMIDIAccess){
  navigator.requestMIDIAccess().then( midi.onMIDIInit, midi.onMIDIReject );
}else {
  console.log("No browser MIDI support, please check out http://jazz-soft.net/ and get that browser fixed!")
}
*/

require("./midilib.js");
var midi = require("./midi.js");
/*
var player = require("./midi/player.js");
var audiodetect = require("./midi/audiodetect.js");
var plugin = require("./midi/plugin.webaudio.js");
var pluginmidi = require("./midi/plugin.webmidi.js");
var util1 = require("dom_request_xhr.js");
var util2 = require("dom_request_script.js");
var gm = require("./midi/gm.js");
var loader = require("./midi/loader.js");
var color = require("./midi/colorspace.js");
*/


var m;      
m = new MidiPlayer("song.mid", "player");

$(function() {
$("#player").click(function(){
    m.play();
    console.log("CLICK");
});
});


console.log("MIDI Test Initiated...");
if (navigator.requestMIDIAccess){
  navigator.requestMIDIAccess().then( midi.onMIDIInit, midi.onMIDIReject );
}else {
  console.log("No browser MIDI support, please check out http://jazz-soft.net/ and get that browser fixed!")
}

console.log("HERE");
