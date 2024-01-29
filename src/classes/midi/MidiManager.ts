import MidiMessageDecoder from "./MidiMessageDecoder";
import MidiPort, { MidiPortDirection } from "./MidiPort";
import MidiClock from "./MidiClock";
import MidiMessage from "./MidiMessage";
import MidiMachine from "./MidiMachine";

// A checkbox item for a MIDI port returned by the list function in the MIDI manager.
interface MidiPortCheckboxItem {
  id: string;
  text: string;
  checked: boolean;
}

type EVENT_TYPES = "beat" | "midiSuccess" | "midiFail";

// The main MIDI manager class manages midi ports and midi messages.
//
class MidiManager {
  midiAccess: MIDIAccess | undefined;
  inPorts: { [key: string]: MidiPort };
  outPorts: { [key: string]: MidiPort };
  activeOutPorts: { [key: string]: MIDIOutput };
  clock: MidiClock;
  midiMachines: MidiMachine[];
  eventHandlers: {
    [key in EVENT_TYPES]: ((...args: any[]) => any)[];
  };
  /**
   * new MIDI manager instance.
   * @param successCallback The success callback function.
   */
  constructor(successCallback: () => void, failCallback?: () => void) {
    this.midiAccess = undefined;
    this.clock = new MidiClock(this);
    this.inPorts = {};
    this.outPorts = {};
    this.activeOutPorts = {};
    this.midiMachines = [];
    this.eventHandlers = { beat: [], midiSuccess: [], midiFail: [] };

    this.addEventListener("midiSuccess", successCallback);
    if (failCallback) {
      this.addEventListener("midiFail", failCallback);
    }

    /**
     * Handles MIDI failure by logging an error message to the console.
     * occurs when the browser does not support MIDI.
     * @param msg - The error provided by the browser.
     */
    const onMIDIFailure = (msg: string) => {
      // TODO: Add callback
      console.error(`Failed to get MIDI access - ${msg}`);
    };

    navigator
      .requestMIDIAccess()
      .then(this.onMIDISuccess.bind(this), onMIDIFailure);
  }

  removeEventListener(event: string, callback: any) {
    if (event === "beat") {
      const idx = this.eventHandlers.beat.indexOf(callback);
      if (idx > -1) {
        this.eventHandlers.beat.splice(idx, 1);
      }
    }
  }
  addEventListener(event: EVENT_TYPES, callback: any) {
    this.eventHandlers[event].push(callback);
  }

  /**
   * @param beatCount The current beat count.
   */
  beatHandler(beatCount: number, bpm: number) {
    this.eventHandlers.beat.forEach((cb) => {
      cb(beatCount, bpm);
    }, this);
  }

  /**
   * Adds a MIDI machine to the list of MIDI machines.
   * @param machine The MIDI machine to add.
   */
  addMachine(machine: MidiMachine) {
    if (machine.midiInPort in this.inPorts) {
      console.log("listening to ", machine.midiInPort);

      this.listenToPort(machine.midiInPort);
    } else {
      console.log("port not in port list ", machine.midiInPort);
    }
    if (machine.midiOutPort in this.outPorts) {
      // TODO: ummm
    }
    this.midiMachines.push(machine);
  }

  /**
   * Handles a successful MIDI access request.
   * @param midiAccess The MIDI access object.
   */
  onMIDISuccess(midiAccess: MIDIAccess): void {
    this.midiAccess = midiAccess;
    this.getInputsAndOutputs();

    this.eventHandlers.midiSuccess.forEach((cb) => {
      cb();
    }, this);
  }

  /**
   * Gets the list of MIDI inputs and outputs.
   */
  getInputsAndOutputs(): void {
    if (!this.midiAccess) throw new Error("No Midi Connection");

    const addPort = (
      details: any,
      direction: MidiPortDirection,
      list: { [key: string]: MidiPort }
    ) => {
      list[details.id] = new MidiPort(
        details.id,
        details.manufacturer,
        details.name,
        details.version,
        direction
      );
    };

    for (const entry of this.midiAccess.inputs) {
      addPort(entry[1], "input", this.inPorts);
    }

    for (const entry of this.midiAccess.outputs) {
      addPort(entry[1], "output", this.outPorts);
    }
  }

  /**
   * Gets the list of MIDI ports for a given direction.
   * @param direction The MIDI port direction.
   * @returns The list of MIDI ports.
   */
  getSimplePortList(direction: MidiPortDirection): MidiPortCheckboxItem[] {
    let portList = this.outPorts;
    let returnList: MidiPortCheckboxItem[] = [];
    if (direction === "input") {
      portList = this.inPorts;
    }

    for (const port in portList) {
      const p = portList[port];
      if (p.name.indexOf("Midi Through") !== 0) {
        returnList.push({ id: p.id, text: p.name, checked: p.connected });
      }
    }
    return returnList;
  }

  /**
   * Gets a MIDI port by ID.
   * @param portID The ID of the MIDI port.
   * @returns The MIDI port.
   */
  getPortById(portID: string): MidiPort {
    if (this.inPorts.hasOwnProperty(portID)) {
      return this.inPorts[portID];
    } else {
      return this.outPorts[portID];
    }
  }

  /**
   * Closes a MIDI port.
   * @param portId The ID of the MIDI port to close.
   */
  closePort(portId: string) {
    if (!this.midiAccess) throw new Error("No Midi Connection");
    let port = this.getPortById(portId);
    let p: any;
    if (port.direction == "input") {
      p = this.midiAccess.inputs.get(portId);
    } else {
      p = this.midiAccess.outputs.get(portId);
    }
    port.connected = false;
    p.close();
  }

  /**
   * Sends a MIDI note message to all active output ports.
   * @param channel The MIDI channel number.
   * @param note The note name.
   * @param octave The octave number.
   */
  sendNote(channel: number, note: string, octave: number) {
    const m = new MidiMessage();
    this.sendToAll(m.noteOn(channel, this.makeNote(note, octave)));
    setTimeout(() => {
      this.sendToAll(m.noteOff(channel, this.makeNote(note, octave)));
    }, 5);
  }

  /**
   * Sends a MIDI message to all active output ports.
   * @param thingToSend The MIDI message to send.
   */
  sendToAll(thingToSend: any) {
    for (const port in this.activeOutPorts) {
      const op = this.activeOutPorts[port];
      console.log(thingToSend);

      op.send(thingToSend); //omitting the timestamp means send immediately.
    }
  }

  /**
   * Sends an FX message to all active output ports.
   * @param ccNumber The control change number.
   * @param ccValue The control change value.
   */
  sendFXMessage(ccNumber: number, ccValue: number) {
    console.log(ccNumber, ccValue);

    // for (let i = 0; i < this.fxChannels.length; i++) {
    //   this.sendCC(this.fxChannels[i], ccNumber, ccValue);
    //}
  }

  /**
   * Sends a control change message to all active output ports.
   * @param channel The MIDI channel number.
   * @param ccNumber The control change number.
   * @param ccValue The control change value.
   */
  sendCC(channel: number, ccNumber: number, ccValue: number) {
    const m = new MidiMessage();
    const message = m.ccValue(channel, ccNumber, ccValue);
    this.sendToAll(message);
  }

  /**
   * Creates a MIDI note from a note name and octave number.
   * @param note The note name eg C
   * @param octave The octave number 4.
   * @returns The MIDI note eg C4.
   */
  makeNote(note: string, octave: number) {
    return note + octave;
  }

  /**
   * Sends a MIDI note on message to all active output ports.
   * @param channel The MIDI channel number.
   * @param note The note name including the octave eg C4
   */
  noteDown(channel: number, note: string) {
    const m = new MidiMessage();
    console.log("note on");

    this.sendToAll(m.noteOn(channel, note));
  }

  /**
   * Sends a MIDI note off message to all active output ports.
   * @param channel The MIDI channel number.
   * @param note The note name including the octave eg C4.
   */
  noteUp(channel: number, note: string) {
    const m = new MidiMessage();
    console.log("note off");
    this.sendToAll(m.noteOff(channel, note));
  }

  /**
   * Listens to a MIDI port.
   * @param portId The ID of the MIDI port to listen to.
   */
  listenToPort(portId: string) {
    if (!this.midiAccess) {
      throw new Error("No Midi Connection");
    }
    let port = this.getPortById(portId);

    if (port.direction == "input") {
      const input = this.midiAccess.inputs.get(portId);

      if (!input) throw new Error("Not A valid Input");

      input.open();
      port.connected = true;
      this.handleMidiMessages(input);
    } else {
      const output = this.midiAccess.outputs.get(portId);
      if (!output) throw new Error("Not A valid Output");
      output.open();
      port.connected = true;
      this.activeOutPorts[portId] = output;
    }
  }

  /**
   * Handles incoming MIDI messages.
   * @param input The MIDI input object.
   */
  private handleMidiMessages(input: MIDIInput) {
    input.onmidimessage = (msg: any) => {
      let midiMessage = new MidiMessageDecoder(msg.data);
      switch (midiMessage.type) {
        case "start":
          this.clock.start();
          break;
        case "clock":
          this.clock.tick();
          break;
        case "stop":
          this.clock.stop();
          break;
        default:
          midiMessage.debugPrint();
          break;
      }
    };
  }
}

export default MidiManager;
