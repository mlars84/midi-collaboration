var socket = io();
socket.on('externalMidi', gotExternalMidiMessage);

// midi oscillator playback
var context = new AudioContext();
var oscillators = {};
var midi, data;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser");
}

function onMIDISuccess(midiData) {
  console.log(midiData);
  midi = midiData;
  var allInputs = midi.inputs.values();
  for (var input = allInputs.next(); input && !input.done; input =
allInputs.next()) {

  }
}

function onMIDIFailure() {
  console.warn("Not finding a MIDI controller");
}

// function that listens for midi messages
function onMIDImessage(messageData) {
  socket.emit('midi', note);
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(messageData.data));
  newItem.className = 'user-midi';
  document.getElementById('midi-data').prepend(newItem);
  var d = messageData.data; // Example: [144, 60, 100]
  var note = {
    on: d[0],
    pitch: d[1],
    velocity: d[2]
  };
  play(note);
}

// function to play the note object that is passed in
function play(note){
    switch(note.on) {
      case 144:
        noteOn(frequency(note.pitch), note.velocity);
        break;
      case 128:
        noteOff(frequency(note.pitch), note.velocity);
        break;
    }
    function frequency(note) {
      return Math.pow(2, ((note - 69) / 12)) * 440;
    }
    function noteOn(frequency, velocity) {
      var osc = oscillators[frequency] = context.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = frequency;
        osc.connect(context.destination);
        osc.start(context.currentTime);
    }
    function noteOff(frequency, velocity) {
        oscillators[frequency].stop(context.currentTime);
        oscillators[frequency].disconnect();
    }
  }

  // function to play any extrenal notes that come in from other users
  function gotExternalMidiMessage(data) {
    var newItem = document.createElement('li');
      newItem.appendChild(document.createTextNode('Note: ' + data.pitch + ' Velocity: ' + data.velocity));
      newItem.className = "external-midi";
      document.getElementById('midi-data').prepend(newItem);
      playNote(data);
  } // end gotExternalMidiMessage
