


//MIDI HANDLING STUFF /////////////////////////////////////////////////////////////////////////

var activeNotes = [];
exports.activeNotes = activeNotes;

exports.onMIDIInit = function(midi) {
console.log("HERE");
			midiAccess = midi;
			if ((typeof(midiAccess.inputs) == "function")) { 
				
				var inputs=midiAccess.inputs();
				
				if (inputs.length === 0){
					console.log('No MIDI input devices detected.');
				}else { // Hook the message handler for all MIDI inputs
				
					for (var i=0;i<inputs.length;i++)
						inputs[i].onmidimessage = exports.MIDIMessageEventHandler;
					console.log('MIDI successful.');
				}
			} else {  // new MIDIMap implementation
				
				var haveAtLeastOneDevice=false;
			    var inputs=midiAccess.inputs.values();

			    for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
			    	input.value.onmidimessage = exports.MIDIMessageEventHandler;
			    	haveAtLeastOneDevice = true;
			   		console.log('MIDI successful.');
			    }

			    if (!haveAtLeastOneDevice){
					console.log("No MIDI input devices detected.");
				}
			}
		}

exports.onMIDIReject = function(err) {
			console.log("MIDI access was rejected, despite the browser supporting it.");
			
		}

exports.MIDIMessageEventHandler = function(event) {

			switch (event.data[0] & 0xf0) {
				case 0x90:
					if (event.data[2]!=0) {  // note-on
						exports.noteOn(event.data[1], event.data[2]);
						return;
					}
				case 0x80: //note off
				  exports.noteOff(event.data[1]);
					return;
				case 0xB0:
					exports.modWheel(event.data[2]);
					return;
			}
		}

exports.modWheel = function(value){
	console.log('modwheel:' + value);
							
	}

exports.frequencyFromNoteNumber = function(note) {
			return 440 * Math.pow(2,(note-69)/12);
		}

exports.noteOn = function(noteNumber, velocity) {
	exports.activeNotes.push(noteNumber);
	

//	updateOscillatorsFromMidiChange();
	
//	$( '#outputNotes' ).html('MIDI notes playing: ' + activeNotes.toString());	
	console.log('active notes:' + exports.activeNotes);
}


exports.noteOff = function(noteNumber) {
	var position = exports.activeNotes.indexOf(noteNumber);
	if (position!=-1) { exports.activeNotes.splice(position,1); }
	
//	updateOscillatorsFromMidiChange();

//	$( '#outputNotes' ).html('MIDI notes playing: ' + activeNotes.toString());
	console.log('active notes:' + exports.activeNotes);

}

/*
function updateOscillatorsFromMidiChange(){
	for (ind in oscArray){
		//get note to play
		var noteNumber = getNoteNumber(oscArray[ind].effectSettings['noteAssignment']);
		
		//compare to playing note and update oscillator frequency
		if (oscArray[ind].playing != noteNumber && noteNumber){
			var now = context.currentTime;
			oscArray[ind].oscillator.frequency.cancelScheduledValues(now);
			oscArray[ind].oscillator.frequency.setValueAtTime(oscArray[ind].oscillator.frequency.value,now);

			if (oscArray[ind].effectSettings['portamentoType']){
				oscArray[ind].oscillator.frequency.linearRampToValueAtTime(oscArray[ind].freqScale*frequencyFromNoteNumber(noteNumber), now + oscArray[ind].effectSettings.portamento);
			}else{
				oscArray[ind].oscillator.frequency.exponentialRampToValueAtTime(oscArray[ind].freqScale*frequencyFromNoteNumber(noteNumber), now + oscArray[ind].effectSettings.portamento);
			}

		}

		//compare note on/off and update envelope
		if (!oscArray[ind].playing && noteNumber){ //was off, now on
			var now = context.currentTime;
			oscArray[ind].envelope.gain.cancelScheduledValues(now);
			oscArray[ind].envelope.gain.setValueAtTime(oscArray[ind].envelope.gain.value, now);

			if (oscArray[ind].effectSettings['attackType']){
				oscArray[ind].envelope.gain.linearRampToValueAtTime(1.0, now + oscArray[ind].effectSettings.attack);
			}else{
				oscArray[ind].envelope.gain.exponentialRampToValueAtTime(1.0, now + oscArray[ind].effectSettings.attack);
			}
		}

		if (oscArray[ind].playing && !noteNumber){ //was on, now off
			var now = context.currentTime;
			oscArray[ind].envelope.gain.cancelScheduledValues(now);
			oscArray[ind].envelope.gain.setValueAtTime(oscArray[ind].envelope.gain.value, now);

			if (oscArray[ind].effectSettings['decayType']){
				oscArray[ind].envelope.gain.linearRampToValueAtTime(0.0, now + oscArray[ind].effectSettings.decay);
			}else{
				oscArray[ind].envelope.gain.exponentialRampToValueAtTime(0.00001, now + oscArray[ind].effectSettings.decay);
			}
		}

		//update playing field
		oscArray[ind].playing = noteNumber;
	}
}
*/
