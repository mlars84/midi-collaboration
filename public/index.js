// public/index.js
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
