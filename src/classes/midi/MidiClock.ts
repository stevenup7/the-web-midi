import MidiManager from "./MidiManager";
import MidiMessage from "./MidiMessage";

/* MidiClock Object 

  role: 

  1/ act as a midi clock slave from a device sending a midi clock signal 
  2/ act as a midi clock master and generate an accuratly timed midi clock for other devices to follow

  secondary roles 

  1/ track beats and bars 
  2/ track 4 (x) bar loops 

  probably make a seperate clock listener 

*/

class MidiClock {
  midiManager: MidiManager;
  clockTimes: number[];
  bpm: number;
  beatCounter: number;
  clockCounter: number;
  running: boolean;
  timerInterval: NodeJS.Timeout | undefined;
  constructor(midiManager: MidiManager) {
    this.midiManager = midiManager;
    // bpm and clock details TODO move to seperate controller
    this.clockTimes = [];
    this.bpm = 0;
    this.beatCounter = 0;
    this.clockCounter = 0;
    this.running = false;
    this.timerInterval = undefined;
  }

  // TODO: this is a very hacky solution
  // needs accurate timing and need to send out a clock signal
  startGenerating() {
    let midiMessage = new MidiMessage();
    let clockMessage = midiMessage.makeClockMessage();
    this.start();
    this.midiManager.sendRealTimeMessage(midiMessage.makePlayControls("start"));
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.tick();
      this.midiManager.sendRealTimeMessage(clockMessage);
      // stop if this.stop is called
      if (this.running == false) {
        clearInterval(this.timerInterval);
      }
    }, 1000 / 24);
  }
  start() {
    this.running = true;
    this.clockTimes = [];
    this.bpm = 0;
    this.beatCounter = 0;
    this.clockCounter = 0;
  }
  stop() {
    this.midiManager.sendRealTimeMessage(
      new MidiMessage().makePlayControls("stop")
    );
    this.midiManager.beatHandler(0, this.bpm);
    this.running = false;
  }

  tick() {
    if (!this.running) return;
    // keep a running list of time intervals intervals since last clock time
    this.clockTimes.push(performance.now());
    if (this.clockTimes.length > 32) {
      this.clockTimes.shift(); // shift off the first element of the array so we only keep a certain length
    }
    let startTime = this.clockTimes[0];
    let endTime = this.clockTimes[this.clockTimes.length - 1];
    let totalInterval = endTime - startTime;
    let clockSpeed =
      60 / ((totalInterval / (this.clockTimes.length - 1) / 1000) * 24); // in seconds
    this.bpm = Math.round(clockSpeed * 10) / 10;
    this.clockCounter++;
    if (this.clockCounter % 6 === 0 && this.clockCounter > 0) {
      this.beatCounter++;
      this.midiManager.beatHandler(this.beatCounter, this.bpm);
    }
  }
}

export default MidiClock;
